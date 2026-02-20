import { create } from "zustand";

type CartItem = {
  productId: string;
  producerId: string;
  name: string;
  unit: "kg" | "piece";
  unitPriceEur: number;
  imageUrl: string | null;
  quantity: number;
};

type CartState = {
  producerId: string | null;
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  producerId: null,
  items: [],
  addItem: (item, quantity = 1) => {
    const state = get();

    if (state.producerId && state.producerId !== item.producerId) {
      set({
        producerId: item.producerId,
        items: [
          {
            ...item,
            quantity
          }
        ]
      });
      return;
    }

    const existing = state.items.find((entry) => entry.productId === item.productId);

    if (existing) {
      set({
        producerId: item.producerId,
        items: state.items.map((entry) =>
          entry.productId === item.productId
            ? {
                ...entry,
                quantity: entry.quantity + quantity
              }
            : entry
        )
      });
      return;
    }

    set({
      producerId: item.producerId,
      items: [
        ...state.items,
        {
          ...item,
          quantity
        }
      ]
    });
  },
  setItemQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set((state) => ({
      items: state.items.map((entry) => (entry.productId === productId ? { ...entry, quantity } : entry))
    }));
  },
  removeItem: (productId) => {
    const items = get().items.filter((entry) => entry.productId !== productId);
    set({
      items,
      producerId: items.length > 0 ? items[0].producerId : null
    });
  },
  clearCart: () =>
    set({
      producerId: null,
      items: []
    }),
  getSubtotal: () =>
    get().items.reduce((sum, item) => {
      return sum + item.unitPriceEur * item.quantity;
    }, 0)
}));
