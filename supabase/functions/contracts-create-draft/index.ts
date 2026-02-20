import { z } from "zod";
import { handleCors } from "../_shared/cors.ts";
import { fail, ok } from "../_shared/response.ts";
import { assertMembership } from "../_shared/auth.ts";
import { createServiceClient, getAuthedUser } from "../_shared/client.ts";

const createDraftSchema = z.object({
  producerOrganizationId: z.string().uuid(),
  restaurantOrganizationId: z.string().uuid(),
  terms: z.record(z.any()),
  changeNote: z.string().optional()
});

Deno.serve(async (request) => {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const user = await getAuthedUser(request);
    const body = createDraftSchema.parse(await request.json());

    await assertMembership(user.id, body.producerOrganizationId, ["producer", "admin"]);

    const service = createServiceClient();

    const { data: contract, error: contractError } = await service
      .from("contracts")
      .insert({
        producer_organization_id: body.producerOrganizationId,
        restaurant_organization_id: body.restaurantOrganizationId,
        status: "draft",
        current_version: 1,
        created_by: user.id,
        updated_by: user.id
      })
      .select("id, status, current_version")
      .single();

    if (contractError || !contract) {
      return fail("Could not create contract draft", 500, contractError?.message);
    }

    const { error: versionError } = await service.from("contract_versions").insert({
      contract_id: contract.id,
      version_number: 1,
      terms_json: body.terms,
      change_note: body.changeNote ?? "Borrador inicial",
      created_by: user.id
    });

    if (versionError) {
      return fail("Contract created but version insertion failed", 500, versionError.message);
    }

    return ok({
      contractId: contract.id,
      version: contract.current_version,
      status: contract.status
    });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
});
