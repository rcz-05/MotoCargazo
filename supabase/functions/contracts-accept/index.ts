import { z } from "zod";
import { handleCors } from "../_shared/cors.ts";
import { fail, ok } from "../_shared/response.ts";
import { assertMembership } from "../_shared/auth.ts";
import { createServiceClient, getAuthedUser } from "../_shared/client.ts";

const acceptanceSchema = z.object({
  contractId: z.string().uuid(),
  version: z.number().int().positive(),
  acceptanceMethod: z.enum(["in_app_checkbox", "otp_email"])
});

Deno.serve(async (request) => {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const user = await getAuthedUser(request);
    const body = acceptanceSchema.parse(await request.json());
    const service = createServiceClient();

    const { data: contract, error: contractError } = await service
      .from("contracts")
      .select("id, restaurant_organization_id")
      .eq("id", body.contractId)
      .single();

    if (contractError || !contract) {
      return fail("Contract not found", 404);
    }

    await assertMembership(user.id, contract.restaurant_organization_id, ["restaurant", "admin"]);

    const nowIso = new Date().toISOString();

    const { error: acceptanceError } = await service.from("contract_acceptances").insert({
      contract_id: body.contractId,
      version_number: body.version,
      accepted_by_user_id: user.id,
      acceptance_method: body.acceptanceMethod,
      accepted_at: nowIso,
      ip_address: request.headers.get("x-forwarded-for") ?? null,
      user_agent: request.headers.get("user-agent") ?? null,
      audit_payload: {
        acceptedAt: nowIso,
        acceptedBy: user.id,
        method: body.acceptanceMethod
      }
    });

    if (acceptanceError) {
      return fail("Failed to register acceptance", 500, acceptanceError.message);
    }

    const { error: updateError } = await service
      .from("contracts")
      .update({
        status: "active",
        active_from: new Date().toISOString().slice(0, 10),
        updated_by: user.id
      })
      .eq("id", body.contractId);

    if (updateError) {
      return fail("Acceptance logged but contract activation failed", 500, updateError.message);
    }

    return ok({
      contractId: body.contractId,
      status: "active",
      acceptedAt: nowIso
    });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
});
