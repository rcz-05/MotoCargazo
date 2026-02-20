import { z } from "zod";
import { handleCors } from "../_shared/cors.ts";
import { fail, ok } from "../_shared/response.ts";
import { assertAnyRole } from "../_shared/auth.ts";
import { createServiceClient, getAuthedUser } from "../_shared/client.ts";

const payloadSchema = z.object({
  eventType: z.string().min(1),
  recipientUserIds: z.array(z.string().uuid()).min(1),
  organizationId: z.string().uuid().optional(),
  title: z.string().min(1),
  body: z.string().min(1),
  payload: z.record(z.any()).optional(),
  channels: z.array(z.enum(["in_app", "email", "push"]))
});

Deno.serve(async (request) => {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const user = await getAuthedUser(request);
    await assertAnyRole(user.id, ["admin", "producer", "restaurant"]);

    const body = payloadSchema.parse(await request.json());
    const service = createServiceClient();

    const rows = body.recipientUserIds.flatMap((recipientId) =>
      body.channels.map((channel) => ({
        recipient_user_id: recipientId,
        organization_id: body.organizationId ?? null,
        channel,
        event_type: body.eventType,
        title: body.title,
        body: body.body,
        payload: body.payload ?? {},
        status: channel === "in_app" ? "sent" : "queued",
        sent_at: channel === "in_app" ? new Date().toISOString() : null
      }))
    );

    const { error } = await service.from("notifications").insert(rows);

    if (error) {
      return fail("Notification insert failed", 500, error.message);
    }

    return ok({
      eventType: body.eventType,
      recipients: body.recipientUserIds.length,
      channels: body.channels,
      inserted: rows.length
    });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
});
