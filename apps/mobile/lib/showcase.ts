import { getDemoProviderImage } from "./demoCatalog";

type CategoryVisual = {
  label: string;
  icon: string;
  coverImage: string;
  accentColor: string;
};

export const categoryVisuals: Record<"meat" | "seafood" | "produce", CategoryVisual> = {
  meat: {
    label: "Carnicerías",
    icon: "🍖",
    coverImage:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80",
    accentColor: "#ef6f68"
  },
  seafood: {
    label: "Pescaderías",
    icon: "🦐",
    coverImage:
      "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=1200&q=80",
    accentColor: "#5fc8f8"
  },
  produce: {
    label: "Vegetales y Frutas",
    icon: "🥬",
    coverImage:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
    accentColor: "#8bd36f"
  }
};

export function producerHeroImage(producerId: string, fallbackCategory?: "meat" | "seafood" | "produce") {
  const demoImage = getDemoProviderImage(producerId, "hero");
  if (demoImage) return demoImage;
  if (fallbackCategory) return categoryVisuals[fallbackCategory].coverImage;
  return "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?auto=format&fit=crop&w=1200&q=80";
}

export function producerCardImage(producerId: string, fallbackCategory?: "meat" | "seafood" | "produce") {
  const demoImage = getDemoProviderImage(producerId, "card");
  if (demoImage) return demoImage;
  return producerHeroImage(producerId, fallbackCategory);
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
