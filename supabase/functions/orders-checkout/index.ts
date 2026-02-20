import { z } from "zod";
import { handleCors } from "../_shared/cors.ts";
import { fail, ok } from "../_shared/response.ts";
import { assertMembership } from "../_shared/auth.ts";
import { createServiceClient, getAuthedUser } from "../_shared/client.ts";

const checkoutSchema = z.object({
  contractId: z.string().uuid(),
  deliveryWindowId: z.string().uuid(),
  vehicleProfileId: z.string().uuid(),
  scheduledDeliveryStart: z.string().datetime(),
  scheduledDeliveryEnd: z.string().datetime(),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().positive(),
        unit: z.enum(["kg", "piece"])
      })
    )
    .min(1)
});

Deno.serve(async (request) => {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const user = await getAuthedUser(request);
    const body = checkoutSchema.parse(await request.json());
    const service = createServiceClient();

    const { data: contract, error: contractError } = await service
      .from("contracts")
      .select("id, status, producer_organization_id, restaurant_organization_id")
      .eq("id", body.contractId)
      .single();

    if (contractError || !contract) {
      return fail("Contract not found", 404);
    }

    if (contract.status !== "active") {
      return fail("Contract must be active before checkout", 409);
    }

    await assertMembership(user.id, contract.restaurant_organization_id, ["restaurant", "admin"]);

    const { data: compliance, error: complianceError } = await service.rpc("validate_delivery_compliance", {
      producer_id_input: contract.producer_organization_id,
      restaurant_id_input: contract.restaurant_organization_id,
      delivery_window_id_input: body.deliveryWindowId,
      vehicle_profile_id_input: body.vehicleProfileId
    });

    if (complianceError) {
      return fail("Could not run compliance validation", 500, complianceError.message);
    }

    if (!compliance?.isCompliant) {
      return fail("Delivery is not compliant", 422, compliance);
    }

    const productIds = body.items.map((item) => item.productId);
    const { data: products, error: productsError } = await service
      .from("products")
      .select("id, base_price_eur")
      .in("id", productIds);

    if (productsError || !products) {
      return fail("Could not load product prices", 500, productsError?.message);
    }

    const priceMap = new Map(products.map((product) => [product.id, Number(product.base_price_eur)]));

    let subtotal = 0;
    const orderItems = body.items.map((item) => {
      const unitPrice = priceMap.get(item.productId);
      if (!unitPrice) {
        throw new Error(`Product price missing for ${item.productId}`);
      }

      const lineTotal = Number((unitPrice * item.quantity).toFixed(2));
      subtotal += lineTotal;

      return {
        product_id: item.productId,
        quantity: item.quantity,
        unit: item.unit,
        unit_price_eur: unitPrice,
        line_total_eur: lineTotal
      };
    });

    const { data: producer, error: producerError } = await service
      .from("producers")
      .select("average_delivery_fee_eur")
      .eq("id", contract.producer_organization_id)
      .single();

    if (producerError || !producer) {
      return fail("Could not load producer delivery fee", 500, producerError?.message);
    }

    const deliveryFee = Number(producer.average_delivery_fee_eur ?? 0);
    const total = Number((subtotal + deliveryFee).toFixed(2));

    const { data: order, error: orderError } = await service
      .from("orders")
      .insert({
        contract_id: contract.id,
        producer_organization_id: contract.producer_organization_id,
        restaurant_organization_id: contract.restaurant_organization_id,
        status: "submitted",
        scheduled_delivery_start: body.scheduledDeliveryStart,
        scheduled_delivery_end: body.scheduledDeliveryEnd,
        delivery_window_id: body.deliveryWindowId,
        vehicle_profile_id: body.vehicleProfileId,
        subtotal_eur: subtotal,
        delivery_fee_eur: deliveryFee,
        total_eur: total,
        compliance_snapshot: compliance,
        created_by: user.id
      })
      .select("id, status")
      .single();

    if (orderError || !order) {
      return fail("Failed to create order", 500, orderError?.message);
    }

    const orderItemsPayload = orderItems.map((item) => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemError } = await service.from("order_items").insert(orderItemsPayload);

    if (itemError) {
      return fail("Order created but inserting items failed", 500, itemError.message);
    }

    const { error: eventError } = await service.from("order_events").insert({
      order_id: order.id,
      previous_status: null,
      next_status: "submitted",
      event_type: "checkout_submitted",
      payload: { total, subtotal, deliveryFee },
      created_by: user.id
    });

    if (eventError) {
      return fail("Order created but event logging failed", 500, eventError.message);
    }

    return ok({
      orderId: order.id,
      producerId: contract.producer_organization_id,
      restaurantId: contract.restaurant_organization_id,
      status: order.status,
      scheduledDeliveryStart: body.scheduledDeliveryStart,
      scheduledDeliveryEnd: body.scheduledDeliveryEnd,
      subtotalEur: subtotal,
      deliveryFeeEur: deliveryFee,
      totalEur: total,
      items: orderItems.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
        unit: item.unit,
        unitPriceEur: item.unit_price_eur,
        lineTotalEur: item.line_total_eur
      }))
    });
  } catch (error) {
    return fail((error as Error).message, 400);
  }
});
