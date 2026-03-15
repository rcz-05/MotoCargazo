import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDemoProviderImage } from "./demoCatalog";
import type { AppImageSource } from "./imageSources";
import { DemoCategoryCode, categoryCover, categoryDefault } from "./demoMedia";

export type CategoryIconDescriptor = {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
};

type CategoryVisual = {
  label: string;
  icon: CategoryIconDescriptor;
  coverImage: AppImageSource;
  accentColor: string;
};

export const categoryVisuals: Record<DemoCategoryCode, CategoryVisual> = {
  meat: {
    label: "Carnicerías",
    icon: {
      name: "food-steak"
    },
    coverImage: categoryCover.meat,
    accentColor: "#C46E5B"
  },
  seafood: {
    label: "Pescaderías",
    icon: {
      name: "fish"
    },
    coverImage: categoryCover.seafood,
    accentColor: "#4F8A9D"
  },
  produce: {
    label: "Vegetales y Frutas",
    icon: {
      name: "carrot"
    },
    coverImage: categoryCover.produce,
    accentColor: "#6C8D55"
  }
};

export function producerHeroImage(producerId: string, fallbackCategory: DemoCategoryCode = "produce") {
  const demoImage = getDemoProviderImage(producerId, "hero");
  if (demoImage) return demoImage;
  return categoryDefault[fallbackCategory];
}

export function producerCardImage(producerId: string, fallbackCategory: DemoCategoryCode = "produce") {
  const demoImage = getDemoProviderImage(producerId, "card");
  if (demoImage) return demoImage;
  return categoryCover[fallbackCategory];
}

export function orderStatusLabel(status: string) {
  switch (status) {
    case "proposed":
      return "Propuesto";
    case "submitted":
      return "Enviado";
    case "accepted_by_producer":
      return "Aceptado por proveedor";
    case "preparing":
      return "En preparación";
    case "out_for_delivery":
      return "En reparto";
    case "delivered":
      return "Entregado";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
}

export function contractStatusLabel(status: string) {
  switch (status) {
    case "draft":
      return "Borrador";
    case "revision_requested":
      return "Revisión solicitada";
    case "accepted":
      return "Aceptado";
    case "active":
      return "Activo";
    case "suspended":
      return "Suspendido";
    case "expired":
      return "Expirado";
    default:
      return status;
  }
}
