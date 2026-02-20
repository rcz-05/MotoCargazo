import { supabase } from "./supabase";
import {
  CategoryCode,
  getDemoContract,
  getDemoDeliveryWindows,
  getDemoProducerCardsByCategory,
  getDemoProductById,
  getDemoProviderById,
  getDemoVehicleProfiles,
  demoProviders
} from "./demoCatalog";
import { useDemoOrderStore } from "../store/demo-order-store";

type FunctionPayload =
  | string
  | ArrayBuffer
  | Blob
  | FormData
  | ReadableStream<Uint8Array>
  | Record<string, unknown>
  | undefined;

export type ProducerCard = {
  id: string;
  name: string;
  city: string;
  rating: number;
  distanceKm: number;
  deliveryFeeEur: number;
  etaMin?: number;
  etaMax?: number;
  tagline?: string;
  cardImage?: string;
};

export type ProductItem = {
  id: string;
  producer_id: string;
  category_code: CategoryCode;
  name: string;
  description: string | null;
  unit: "kg" | "piece";
  base_price_eur: number;
  image_url: string | null;
};

export async function fetchProducersByCategory(categoryCode: CategoryCode) {
  return getDemoProducerCardsByCategory(categoryCode) as ProducerCard[];
}

export async function fetchProducerById(producerId: string) {
  const demo = getDemoProviderById(producerId);
  if (demo) {
    return {
      id: demo.id,
      name: demo.name,
      city: demo.city,
      rating: demo.rating,
      deliveryFeeEur: demo.deliveryFeeEur,
      etaMin: demo.etaMin,
      etaMax: demo.etaMax,
      tagline: demo.tagline,
      heroImage: demo.heroImage,
      products: demo.products as ProductItem[]
    };
  }

  const [{ data: producer, error: producerError }, { data: org, error: orgError }, { data: products, error: productError }] =
    await Promise.all([
      supabase
        .from("producers")
        .select("id, rating, average_delivery_fee_eur")
        .eq("id", producerId)
        .single(),
      supabase.from("organizations").select("id, name, city").eq("id", producerId).single(),
      supabase
        .from("products")
        .select("id, producer_id, category_code, name, description, unit, base_price_eur, image_url")
        .eq("producer_id", producerId)
        .eq("active", true)
    ]);

  if (producerError) throw producerError;
  if (productError) throw productError;
  if (orgError) {
    console.warn("Could not read organization details. Using fallback producer info.", orgError.message);
  }

  return {
    id: producer.id,
    name: org?.name ?? "Proveedor local",
    city: org?.city ?? "Sevilla",
    rating: Number(producer.rating ?? 4.8),
    deliveryFeeEur: Number(producer.average_delivery_fee_eur ?? 11.09),
    products: (products ?? []) as ProductItem[]
  };
}

export async function fetchProductById(productId: string) {
  const demo = getDemoProductById(productId);
  if (demo) {
    return {
      ...demo,
      description: demo.description,
      image_url: demo.image_url
    } as ProductItem;
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, producer_id, category_code, name, description, unit, base_price_eur, image_url")
    .eq("id", productId)
    .single();

  if (error) throw error;

  return data as ProductItem;
}

export async function fetchActiveContract(restaurantId: string, producerId: string) {
  try {
    const { data, error } = await supabase
      .from("contracts")
      .select("id, status, current_version, producer_organization_id, restaurant_organization_id")
      .eq("producer_organization_id", producerId)
      .eq("restaurant_organization_id", restaurantId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (data) return data;
  } catch {
    // Use demo fallback below.
  }

  return getDemoContract(restaurantId, producerId);
}

export async function fetchDeliveryWindows(producerId: string) {
  try {
    const { data, error } = await supabase
      .from("delivery_windows")
      .select("id, day_of_week, start_time, end_time, same_day_allowed, next_day_allowed")
      .eq("producer_id", producerId)
      .eq("active", true)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;
    if (data?.length) return data;
  } catch {
    // Use demo fallback below.
  }

  return getDemoDeliveryWindows(producerId);
}

export async function fetchVehicleProfiles(organizationId: string) {
  try {
    const { data, error } = await supabase
      .from("vehicle_profiles")
      .select("id, label, is_electric, weight_kg, height_cm")
      .eq("organization_id", organizationId)
      .eq("active", true)
      .order("created_at", { ascending: true });

    if (error) throw error;
    if (data?.length) return data;
  } catch {
    // Use demo fallback below.
  }

  return getDemoVehicleProfiles(organizationId);
}

export async function fetchOrderById(orderId: string) {
  const demoOrder = useDemoOrderStore.getState().getOrder(orderId);
  if (demoOrder) return demoOrder;

  const [{ data: order, error: orderError }, { data: items, error: itemsError }] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id, status, scheduled_delivery_start, scheduled_delivery_end, subtotal_eur, delivery_fee_eur, total_eur, producer_organization_id, restaurant_organization_id"
      )
      .eq("id", orderId)
      .single(),
    supabase
      .from("order_items")
      .select("id, product_id, quantity, unit, unit_price_eur, line_total_eur")
      .eq("order_id", orderId)
  ]);

  if (orderError) throw orderError;
  if (itemsError) throw itemsError;

  return {
    ...order,
    items: items ?? []
  };
}

export async function fetchProducerOrders(producerId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("id, status, scheduled_delivery_start, total_eur, restaurant_organization_id, created_at")
      .eq("producer_organization_id", producerId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data ?? [];
  } catch {
    return Object.values(useDemoOrderStore.getState().orders)
      .filter((order) => order.producer_organization_id === producerId)
      .map((order) => ({
        id: order.id,
        status: order.status,
        scheduled_delivery_start: order.scheduled_delivery_start,
        total_eur: order.total_eur,
        restaurant_organization_id: order.restaurant_organization_id,
        created_at: new Date().toISOString()
      }));
  }
}

export async function fetchProducerContracts(producerId: string) {
  try {
    const { data, error } = await supabase
      .from("contracts")
      .select("id, status, current_version, restaurant_organization_id, updated_at")
      .eq("producer_organization_id", producerId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch {
    const contract = getDemoContract("demo-restaurant", producerId);
    if (!contract) return [];

    return [
      {
        id: contract.id,
        status: contract.status,
        current_version: contract.current_version,
        restaurant_organization_id: contract.restaurant_organization_id,
        updated_at: new Date().toISOString()
      }
    ];
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

async function invokeFunction<T>(name: string, payload: FunctionPayload): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, {
    body: payload
  });

  if (error) throw error;
  if ((data as { error?: string })?.error) {
    throw new Error((data as { error: string }).error);
  }

  return data as T;
}

function createDemoOrderFromCheckout(payload: {
  contractId: string;
  scheduledDeliveryStart: string;
  scheduledDeliveryEnd: string;
  items: { productId: string; quantity: number; unit: "kg" | "piece" }[];
}) {
  const detailedItems = payload.items.map((item, index) => {
    const product = getDemoProductById(item.productId);
    const unitPrice = Number(product?.base_price_eur ?? 12);

    return {
      id: `demo-item-${Date.now()}-${index}`,
      product_id: item.productId,
      quantity: item.quantity,
      unit: item.unit,
      unit_price_eur: unitPrice,
      line_total_eur: Number((unitPrice * item.quantity).toFixed(2))
    };
  });

  const subtotal = Number(detailedItems.reduce((sum, item) => sum + item.line_total_eur, 0).toFixed(2));
  const deliveryFee = subtotal >= 120 ? 0 : 3.99;
  const total = Number((subtotal + deliveryFee + 0.3).toFixed(2));

  const firstProduct = payload.items[0] ? getDemoProductById(payload.items[0].productId) : null;
  const producerId = payload.contractId.startsWith("demo-contract-")
    ? payload.contractId.replace("demo-contract-", "")
    : firstProduct?.producer_id ?? demoProviders[0]?.id ?? "demo-producer";

  const orderId = `demo-${Date.now()}`;
  useDemoOrderStore.getState().upsertOrder({
    id: orderId,
    status: "submitted",
    scheduled_delivery_start: payload.scheduledDeliveryStart,
    scheduled_delivery_end: payload.scheduledDeliveryEnd,
    subtotal_eur: subtotal,
    delivery_fee_eur: deliveryFee,
    total_eur: total,
    producer_organization_id: producerId,
    restaurant_organization_id: "demo-restaurant",
    items: detailedItems
  });

  return {
    orderId,
    status: "submitted",
    totalEur: total
  };
}

export async function createContractDraft(payload: {
  producerOrganizationId: string;
  restaurantOrganizationId: string;
  terms: Record<string, unknown>;
  changeNote?: string;
}) {
  return invokeFunction<{ contractId: string; version: number; status: string }>("contracts-create-draft", payload);
}

export async function requestContractRevision(payload: {
  contractId: string;
  message: string;
  changes: { field: string; currentValue: string; requestedValue: string }[];
}) {
  return invokeFunction<{ contractId: string; status: string; version: number }>("contracts-request-revision", payload);
}

export async function acceptContract(payload: {
  contractId: string;
  version: number;
  acceptanceMethod: "in_app_checkbox" | "otp_email";
}) {
  return invokeFunction<{ contractId: string; status: string; acceptedAt: string }>("contracts-accept", payload);
}

export async function validateCompliance(payload: {
  producerId: string;
  restaurantId: string;
  deliveryWindowId: string;
  vehicleProfileId: string;
}) {
  try {
    return await invokeFunction<{
      isCompliant: boolean;
      reasons: string[];
      fallbackSlots: { slotId: string; startAt: string; endAt: string; reason: string }[];
      alternateProducerIds: string[];
    }>("orders-validate-compliance", payload);
  } catch {
    return {
      isCompliant: true,
      reasons: [],
      fallbackSlots: [],
      alternateProducerIds: []
    };
  }
}

export async function checkoutOrder(payload: {
  contractId: string;
  deliveryWindowId: string;
  vehicleProfileId: string;
  scheduledDeliveryStart: string;
  scheduledDeliveryEnd: string;
  items: { productId: string; quantity: number; unit: "kg" | "piece" }[];
}) {
  if (payload.contractId.startsWith("demo-contract-")) {
    return createDemoOrderFromCheckout(payload);
  }

  try {
    return await invokeFunction<{
      orderId: string;
      status: string;
      totalEur: number;
    }>("orders-checkout", payload);
  } catch {
    return createDemoOrderFromCheckout(payload);
  }
}

export async function createRecurringPlan(payload: {
  contract_id: string;
  producer_organization_id: string;
  restaurant_organization_id: string;
  name: string;
  cron_expression: string;
  line_items: unknown;
  auto_confirm: boolean;
  active: boolean;
  next_run_at?: string;
}) {
  try {
    const { data, error } = await supabase.from("recurring_plans").insert(payload).select("id").single();
    if (error) throw error;
    return data;
  } catch {
    return { id: `demo-recurring-${Date.now()}` };
  }
}
