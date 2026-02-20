import { z } from "zod";
import { handleCors } from "../_shared/cors.ts";
import { fail, ok } from "../_shared/response.ts";
import { createServiceClient, getAuthedUser } from "../_shared/client.ts";

const validationSchema = z.object({
  producerId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  deliveryWindowId: z.string().uuid(),
  vehicleProfileId: z.string().uuid()
});

Deno.serve(async (request) => {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    await getAuthedUser(request);
    const body = validationSchema.parse(await request.json());
    const service = createServiceClient();

    const { data, error } = await service.rpc("validate_delivery_compliance", {
      producer_id_input: body.producerId,
      restaurant_id_input: body.restaurantId,
      delivery_window_id_input: body.deliveryWindowId,
      vehicle_profile_id_input: body.vehicleProfileId
    });

    if (error) {
      return fail("Compliance validation failed", 500, error.message);
    }

    return ok(data);
  } catch (error) {
    return fail((error as Error).message, 400);
  }
});
