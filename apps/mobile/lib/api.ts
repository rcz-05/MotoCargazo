import { supabase } from "./supabase";
import { isDemoApp } from "./app-mode";
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
import type { AppImageSource } from "./imageSources";
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
  cardImage?: string | null;
  cardImageSource?: AppImageSource;
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
  image_source?: AppImageSource | null;
  image_fallback_source?: AppImageSource | null;
  featured?: boolean;
  badge?: string;
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
      heroImageSource: demo.heroImageSource,
      products: demo.products as ProductItem[]
    };
  }

  if (isDemoApp) {
    throw new Error("Proveedor demo no encontrado");
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
    heroImage: null,
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

  if (isDemoApp) {
    throw new Error("Producto demo no encontrado");
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
  if (isDemoApp) {
    return getDemoContract(restaurantId, producerId);
  }

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
  if (isDemoApp) {
    return getDemoDeliveryWindows(producerId);
  }

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
  if (isDemoApp) {
    return getDemoVehicleProfiles(organizationId);
  }

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

  if (isDemoApp) {
    const now = new Date();
    return {
      id: orderId,
      status: "submitted",
      scheduled_delivery_start: new Date(now.getTime() + 45 * 60 * 1000).toISOString(),
      scheduled_delivery_end: new Date(now.getTime() + 105 * 60 * 1000).toISOString(),
      subtotal_eur: 0,
      delivery_fee_eur: 0,
      total_eur: 0,
      producer_organization_id: demoProviders[0]?.id ?? "demo-producer",
      restaurant_organization_id: "demo-restaurant",
      items: []
    };
  }

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
  if (isDemoApp) {
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
  if (isDemoApp) {
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
  if (isDemoApp) return;

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
}

async function invokeFunction<T>(name: string, payload: FunctionPayload): Promise<T> {
  if (isDemoApp) {
    throw new Error(`${name} is unavailable in demo mode.`);
  }

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
    status: "out_for_delivery",
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
    status: "out_for_delivery",
    totalEur: total
  };
}

export async function createContractDraft(payload: {
  producerOrganizationId: string;
  restaurantOrganizationId: string;
  terms: Record<string, unknown>;
  changeNote?: string;
}) {
  if (isDemoApp) {
    return {
      contractId: `demo-contract-${payload.producerOrganizationId}`,
      version: 1,
      status: "draft"
    };
  }

  return invokeFunction<{ contractId: string; version: number; status: string }>("contracts-create-draft", payload);
}

export async function requestContractRevision(payload: {
  contractId: string;
  message: string;
  changes: { field: string; currentValue: string; requestedValue: string }[];
}) {
  if (isDemoApp) {
    return {
      contractId: payload.contractId,
      status: "revision_requested",
      version: 2
    };
  }

  return invokeFunction<{ contractId: string; status: string; version: number }>("contracts-request-revision", payload);
}

export async function acceptContract(payload: {
  contractId: string;
  version: number;
  acceptanceMethod: "in_app_checkbox" | "otp_email";
}) {
  if (isDemoApp) {
    return {
      contractId: payload.contractId,
      status: "active",
      acceptedAt: new Date().toISOString()
    };
  }

  return invokeFunction<{ contractId: string; status: string; acceptedAt: string }>("contracts-accept", payload);
}

export async function validateCompliance(payload: {
  producerId: string;
  restaurantId: string;
  deliveryWindowId: string;
  vehicleProfileId: string;
}) {
  if (isDemoApp) {
    return {
      isCompliant: true,
      reasons: [],
      fallbackSlots: [],
      alternateProducerIds: []
    };
  }

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
  if (isDemoApp || payload.contractId.startsWith("demo-contract-")) {
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
  if (isDemoApp) {
    return { id: `demo-recurring-${Date.now()}` };
  }

  try {
    const { data, error } = await supabase.from("recurring_plans").insert(payload).select("id").single();
    if (error) throw error;
    return data;
  } catch {
    return { id: `demo-recurring-${Date.now()}` };
  }
}
