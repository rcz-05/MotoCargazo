import { create } from "zustand";
import { orderStatusLabel } from "../lib/showcase";

type DemoOrderStatus = "submitted" | "accepted_by_producer" | "preparing" | "out_for_delivery" | "delivered";

type DemoOrderItem = {
  id: string;
  product_id: string;
  quantity: number;
  unit: "kg" | "piece";
  unit_price_eur: number;
  line_total_eur: number;
};

export type DemoOrderRecord = {
  id: string;
  status: DemoOrderStatus;
  scheduled_delivery_start: string;
  scheduled_delivery_end: string;
  subtotal_eur: number;
  delivery_fee_eur: number;
  total_eur: number;
  producer_organization_id: string;
  restaurant_organization_id: string;
  items: DemoOrderItem[];
  timeline: Array<{ key: DemoOrderStatus; label: string; reached: boolean }>;
};

type DemoOrderState = {
  orders: Record<string, DemoOrderRecord>;
  upsertOrder: (order: Omit<DemoOrderRecord, "timeline">) => void;
  advanceOrderStatus: (orderId: string) => void;
  getOrder: (orderId: string) => DemoOrderRecord | null;
};

const statusFlow: DemoOrderStatus[] = ["submitted", "accepted_by_producer", "preparing", "out_for_delivery", "delivered"];

function buildTimeline(status: DemoOrderStatus) {
  const reachedIndex = statusFlow.indexOf(status);
  return statusFlow.map((state, index) => ({
    key: state,
    label: orderStatusLabel(state),
    reached: index <= reachedIndex
  }));
}

export const useDemoOrderStore = create<DemoOrderState>((set, get) => ({
  orders: {},
  upsertOrder: (order) =>
    set((state) => ({
      orders: {
        ...state.orders,
        [order.id]: {
          ...order,
          timeline: buildTimeline(order.status)
        }
      }
    })),
  advanceOrderStatus: (orderId) => {
    const order = get().orders[orderId];
    if (!order) return;

    const currentIndex = statusFlow.indexOf(order.status);
    const nextStatus = statusFlow[Math.min(currentIndex + 1, statusFlow.length - 1)];

    set((state) => ({
      orders: {
        ...state.orders,
        [orderId]: {
          ...order,
          status: nextStatus,
          timeline: buildTimeline(nextStatus)
        }
      }
    }));
  },
  getOrder: (orderId) => get().orders[orderId] ?? null
}));
