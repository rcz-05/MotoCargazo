import { z } from "zod";
import { handleCors } from "../_shared/cors.ts";
import { fail, ok } from "../_shared/response.ts";
import { assertMembership } from "../_shared/auth.ts";
import { createServiceClient, getAuthedUser } from "../_shared/client.ts";

const revisionSchema = z.object({
  contractId: z.string().uuid(),
  message: z.string().min(5),
  changes: z
    .array(
      z.object({
        field: z.string(),
        currentValue: z.string(),
        requestedValue: z.string()
      })
    )
    .default([])
});

Deno.serve(async (request) => {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const user = await getAuthedUser(request);
    const body = revisionSchema.parse(await request.json());
    const service = createServiceClient();

    const { data: contract, error: contractError } = await service
      .from("contracts")
      .select("id, restaurant_organization_id, producer_organization_id, current_version")
      .eq("id", body.contractId)
      .single();

    if (contractError || !contract) {
      return fail("Contract not found", 404);
    }

    await assertMembership(user.id, contract.restaurant_organization_id, ["restaurant", "admin"]);

    const { error: updateError } = await service
      .from("contracts")
      .update({ status: "revision_requested", updated_by: user.id })
      .eq("id", body.contractId);

    if (updateError) {
      return fail("Could not update contract revision status", 500, updateError.message);
    }

    const { data: existingVersion, error: existingVersionError } = await service
      .from("contract_versions")
      .select("terms_json")
      .eq("contract_id", body.contractId)
      .eq("version_number", contract.current_version)
      .single();

    if (existingVersionError || !existingVersion) {
      return fail("Could not load current contract terms", 500, existingVersionError?.message);
    }

    const nextVersion = contract.current_version + 1;

    const { error: versionError } = await service.from("contract_versions").insert({
      contract_id: body.contractId,
      version_number: nextVersion,
      terms_json: {
        ...existingVersion.terms_json,
        requestedChanges: body.changes,
        revisionMessage: body.message,
        revisionRequestedAt: new Date().toISOString(),
        revisionRequestedBy: user.id
      },
      change_note: body.message,
      created_by: user.id
    });

    if (versionError) {
      return fail("Could not store revision details", 500, versionError.message);
    }

    const { error: bumpVersionError } = await service
      .from("contracts")
      .update({ current_version: nextVersion, updated_by: user.id })
      .eq("id", body.contractId);

    if (bumpVersionError) {
      return fail("Revision saved but version number update failed", 500, bumpVersionError.message);
    }

    return ok({
      contractId: body.contractId,
      status: "revision_requested",
      version: nextVersion
    });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
});
