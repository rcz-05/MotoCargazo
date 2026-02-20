import { z } from "zod";
import { handleCors } from "../_shared/cors.ts";
import { fail, ok } from "../_shared/response.ts";
import { assertAnyRole } from "../_shared/auth.ts";
import { createServiceClient, getAuthedUser } from "../_shared/client.ts";

const payloadSchema = z.object({
  planId: z.string().uuid().optional()
});

Deno.serve(async (request) => {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const user = await getAuthedUser(request);
    await assertAnyRole(user.id, ["admin", "restaurant"]);

    const json = request.method === "POST" ? await request.json().catch(() => ({})) : {};
    const body = payloadSchema.parse(json);

    const service = createServiceClient();
    const { data, error } = await service.rpc("generate_recurring_orders", {
      plan_filter: body.planId ?? null
    });

    if (error) {
      return fail("Recurring generation failed", 500, error.message);
    }

    return ok({
      generated: data ?? []
    });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
});
