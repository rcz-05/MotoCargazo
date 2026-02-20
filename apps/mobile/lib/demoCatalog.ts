export type CategoryCode = "meat" | "seafood" | "produce";

export type DemoProduct = {
  id: string;
  producer_id: string;
  category_code: CategoryCode;
  name: string;
  description: string;
  unit: "kg" | "piece";
  base_price_eur: number;
  image_url: string;
  featured?: boolean;
};

export type DemoProvider = {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  rating: number;
  categories: CategoryCode[];
  deliveryFeeEur: number;
  etaMin: number;
  etaMax: number;
  distanceKm: number;
  cardImage: string;
  heroImage: string;
  tagline: string;
  products: DemoProduct[];
};

const marketImages = {
  produceFront:
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1600&q=80",
  produceBoxes:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
  fishCounter:
    "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=1600&q=80",
  fishClose:
    "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=1600&q=80",
  meatCounter:
    "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1600&q=80",
  meatAged:
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80",
  jamon:
    "https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&w=1600&q=80",
  marketHall:
    "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?auto=format&fit=crop&w=1600&q=80",
  marketStreet:
    "https://images.unsplash.com/photo-1607623816075-5c7c1f0f5f2a?auto=format&fit=crop&w=1600&q=80",
  seafoodPrep:
    "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1600&q=80",
  produceTable:
    "https://images.unsplash.com/photo-1464454709131-ffd692591ee5?auto=format&fit=crop&w=1600&q=80"
};

type ProviderSeed = {
  name: string;
  rating: number;
  categories: CategoryCode[];
  neighborhood: string;
  deliveryFeeEur: number;
  etaMin: number;
  etaMax: number;
  distanceKm: number;
  cardImage: string;
  heroImage: string;
  tagline: string;
};

const providerSeeds: ProviderSeed[] = [
  {
    name: "Mercado de Feria",
    rating: 4.5,
    categories: ["produce"],
    neighborhood: "Feria",
    deliveryFeeEur: 2.49,
    etaMin: 18,
    etaMax: 30,
    distanceKm: 1.2,
    cardImage: marketImages.produceFront,
    heroImage: marketImages.produceBoxes,
    tagline: "Fruta y verdura diaria para mise en place"
  },
  {
    name: "Pescados y Mariscos Javi",
    rating: 4.8,
    categories: ["seafood"],
    neighborhood: "Triana",
    deliveryFeeEur: 3.2,
    etaMin: 22,
    etaMax: 35,
    distanceKm: 2.1,
    cardImage: marketImages.fishCounter,
    heroImage: marketImages.seafoodPrep,
    tagline: "Pescado de lonja con corte para hostelería"
  },
  {
    name: "Pescadería Maldonado",
    rating: 4.7,
    categories: ["seafood"],
    neighborhood: "Nervión",
    deliveryFeeEur: 3.49,
    etaMin: 24,
    etaMax: 36,
    distanceKm: 2.7,
    cardImage: marketImages.fishClose,
    heroImage: marketImages.fishCounter,
    tagline: "Especialistas en pescado blanco y azul"
  },
  {
    name: "Pescados y mariscos Soruco",
    rating: 3.5,
    categories: ["seafood"],
    neighborhood: "Macarena",
    deliveryFeeEur: 2.95,
    etaMin: 25,
    etaMax: 38,
    distanceKm: 3.4,
    cardImage: marketImages.seafoodPrep,
    heroImage: marketImages.fishClose,
    tagline: "Oferta de marisco fresco y congelado"
  },
  {
    name: "Carniceria El Bierzo",
    rating: 4.2,
    categories: ["meat"],
    neighborhood: "Los Remedios",
    deliveryFeeEur: 3.9,
    etaMin: 24,
    etaMax: 35,
    distanceKm: 2.9,
    cardImage: marketImages.jamon,
    heroImage: marketImages.meatAged,
    tagline: "Cortes premium y jamonería"
  },
  {
    name: "Mercado de la Encarnación",
    rating: 4.8,
    categories: ["meat", "seafood", "produce"],
    neighborhood: "Encarnación",
    deliveryFeeEur: 2.29,
    etaMin: 16,
    etaMax: 28,
    distanceKm: 0.9,
    cardImage: marketImages.marketHall,
    heroImage: marketImages.marketStreet,
    tagline: "Mercado integral para compras semanales"
  },
  {
    name: "Marisquería La Mar de Fresquita",
    rating: 4.1,
    categories: ["seafood"],
    neighborhood: "Arenal",
    deliveryFeeEur: 3.45,
    etaMin: 22,
    etaMax: 34,
    distanceKm: 1.8,
    cardImage: marketImages.fishCounter,
    heroImage: marketImages.seafoodPrep,
    tagline: "Marisco de temporada y limpieza en origen"
  },
  {
    name: "CARNICERÍA EL ORIGEN",
    rating: 4.9,
    categories: ["meat"],
    neighborhood: "Centro",
    deliveryFeeEur: 3.99,
    etaMin: 20,
    etaMax: 32,
    distanceKm: 1.5,
    cardImage: marketImages.meatAged,
    heroImage: marketImages.jamon,
    tagline: "Especialidad en carnes maduradas"
  },
  {
    name: "Carnicería Almansa",
    rating: 4.8,
    categories: ["meat"],
    neighborhood: "Nervión",
    deliveryFeeEur: 3.39,
    etaMin: 21,
    etaMax: 34,
    distanceKm: 2.2,
    cardImage: marketImages.meatCounter,
    heroImage: marketImages.meatAged,
    tagline: "Carnes de corte clásico para menú diario"
  },
  {
    name: "Pescadería La Almadraba Sevilla",
    rating: 4.6,
    categories: ["seafood"],
    neighborhood: "San Bernardo",
    deliveryFeeEur: 3.69,
    etaMin: 23,
    etaMax: 35,
    distanceKm: 2.4,
    cardImage: marketImages.fishClose,
    heroImage: marketImages.fishCounter,
    tagline: "Atún y pescado azul de almadraba"
  },
  {
    name: "Mercado del Arenal",
    rating: 4.1,
    categories: ["meat", "seafood", "produce"],
    neighborhood: "Arenal",
    deliveryFeeEur: 2.59,
    etaMin: 19,
    etaMax: 31,
    distanceKm: 1.4,
    cardImage: marketImages.marketStreet,
    heroImage: marketImages.marketHall,
    tagline: "Todo en un solo pedido para cocina urbana"
  },
  {
    name: "Mercado de Triana",
    rating: 4.5,
    categories: ["meat", "seafood", "produce"],
    neighborhood: "Triana",
    deliveryFeeEur: 2.19,
    etaMin: 17,
    etaMax: 29,
    distanceKm: 1.6,
    cardImage: marketImages.marketHall,
    heroImage: marketImages.produceFront,
    tagline: "Mercado tradicional con puestos históricos"
  },
  {
    name: "Mercado Puerta De La Carne",
    rating: 4.2,
    categories: ["meat", "seafood", "produce"],
    neighborhood: "Puerta de la Carne",
    deliveryFeeEur: 2.79,
    etaMin: 18,
    etaMax: 31,
    distanceKm: 1.9,
    cardImage: marketImages.meatCounter,
    heroImage: marketImages.marketStreet,
    tagline: "Foco en carnes con oferta fresca completa"
  },
  {
    name: "Mercado de Los Remedios",
    rating: 4.1,
    categories: ["meat", "seafood", "produce"],
    neighborhood: "Los Remedios",
    deliveryFeeEur: 2.95,
    etaMin: 21,
    etaMax: 34,
    distanceKm: 3.2,
    cardImage: marketImages.produceBoxes,
    heroImage: marketImages.marketHall,
    tagline: "Compra integral para restaurantes de barrio"
  },
  {
    name: "Mercado San Gonzalo",
    rating: 4.5,
    categories: ["meat", "seafood"],
    neighborhood: "Triana Oeste",
    deliveryFeeEur: 2.99,
    etaMin: 22,
    etaMax: 34,
    distanceKm: 3.1,
    cardImage: marketImages.fishCounter,
    heroImage: marketImages.meatCounter,
    tagline: "Meat + seafood para cartas mixtas"
  },
  {
    name: "La Carniceria El Tardón",
    rating: 5,
    categories: ["meat"],
    neighborhood: "El Tardón",
    deliveryFeeEur: 3.29,
    etaMin: 20,
    etaMax: 32,
    distanceKm: 2.6,
    cardImage: marketImages.jamon,
    heroImage: marketImages.meatAged,
    tagline: "Cortes de autor y trazabilidad premium"
  },
  {
    name: "Carniceria Esteban Charcuteria",
    rating: 4.7,
    categories: ["meat"],
    neighborhood: "Alfalfa",
    deliveryFeeEur: 3.19,
    etaMin: 21,
    etaMax: 33,
    distanceKm: 1.7,
    cardImage: marketImages.jamon,
    heroImage: marketImages.meatCounter,
    tagline: "Charcutería y embutidos para tapas"
  },
  {
    name: "Mercado de Abastos Tiro de Línea",
    rating: 4.2,
    categories: ["meat", "seafood", "produce"],
    neighborhood: "Tiro de Línea",
    deliveryFeeEur: 3.05,
    etaMin: 24,
    etaMax: 38,
    distanceKm: 4.2,
    cardImage: marketImages.marketStreet,
    heroImage: marketImages.produceTable,
    tagline: "Producto fresco de barrio para volumen"
  },
  {
    name: "Carnicería Manolo Rodriguez",
    rating: 4.8,
    categories: ["meat"],
    neighborhood: "Heliópolis",
    deliveryFeeEur: 3.09,
    etaMin: 22,
    etaMax: 35,
    distanceKm: 3.5,
    cardImage: marketImages.meatCounter,
    heroImage: marketImages.meatAged,
    tagline: "Carnes de vacuno y cerdo de confianza"
  },
  {
    name: "Pescadería Loli Y Antonio",
    rating: 5,
    categories: ["seafood"],
    neighborhood: "Nervión",
    deliveryFeeEur: 3.29,
    etaMin: 22,
    etaMax: 34,
    distanceKm: 2.3,
    cardImage: marketImages.seafoodPrep,
    heroImage: marketImages.fishCounter,
    tagline: "Pescado limpio, porcionado y etiquetado"
  },
  {
    name: "Polleria - Recova gayoso",
    rating: 3.5,
    categories: ["meat"],
    neighborhood: "Macarena",
    deliveryFeeEur: 2.69,
    etaMin: 23,
    etaMax: 37,
    distanceKm: 3.6,
    cardImage: marketImages.meatCounter,
    heroImage: marketImages.marketStreet,
    tagline: "Especialistas en pollo fresco y despiece"
  },
  {
    name: "Frutería Carmeli",
    rating: 4.7,
    categories: ["produce"],
    neighborhood: "San Bernardo",
    deliveryFeeEur: 2.45,
    etaMin: 19,
    etaMax: 32,
    distanceKm: 2.1,
    cardImage: marketImages.produceTable,
    heroImage: marketImages.produceFront,
    tagline: "Fruta de temporada para desayunos y postres"
  },
  {
    name: "Carniceria Alfonso",
    rating: 4.8,
    categories: ["meat"],
    neighborhood: "Triana",
    deliveryFeeEur: 2.99,
    etaMin: 20,
    etaMax: 33,
    distanceKm: 2.4,
    cardImage: marketImages.meatCounter,
    heroImage: marketImages.jamon,
    tagline: "Cortes para plancha, horno y guiso"
  },
  {
    name: "Pescadería La lonja de Andrés",
    rating: 5,
    categories: ["seafood"],
    neighborhood: "Arenal",
    deliveryFeeEur: 3.39,
    etaMin: 21,
    etaMax: 34,
    distanceKm: 1.9,
    cardImage: marketImages.fishClose,
    heroImage: marketImages.seafoodPrep,
    tagline: "Selección premium de lonja diaria"
  },
  {
    name: "PESCADERÍA CABO TRAFALGAR",
    rating: 5,
    categories: ["seafood"],
    neighborhood: "Los Remedios",
    deliveryFeeEur: 3.49,
    etaMin: 23,
    etaMax: 35,
    distanceKm: 3.3,
    cardImage: marketImages.fishCounter,
    heroImage: marketImages.fishClose,
    tagline: "Pescado de costa con control de frescura"
  }
];

type ProductTemplate = {
  name: string;
  description: string;
  unit: "kg" | "piece";
  basePrice: number;
  image: string;
};

const meatTemplates: ProductTemplate[] = [
  {
    name: "Chuletón vaca madurada",
    description: "Corte premium para parrilla a alta temperatura.",
    unit: "kg",
    basePrice: 34.5,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Presa ibérica",
    description: "Ideal para plancha y acabados rápidos de servicio.",
    unit: "kg",
    basePrice: 22.9,
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Solomillo de ternera",
    description: "Pieza limpia para raciones premium.",
    unit: "kg",
    basePrice: 36.2,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Secreto ibérico",
    description: "Alta infiltración para carta de brasa.",
    unit: "kg",
    basePrice: 19.4,
    image: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Costilla de cerdo",
    description: "Formato para horno y servicio de raciones.",
    unit: "kg",
    basePrice: 11.8,
    image: "https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Contramuslo de pollo limpio",
    description: "Deshuesado y preparado para mise en place.",
    unit: "kg",
    basePrice: 8.9,
    image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Jamón ibérico cebo campo",
    description: "Curación larga para charcutería y tapas.",
    unit: "piece",
    basePrice: 129,
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Carrillera de vacuno",
    description: "Pieza para guisos de larga cocción.",
    unit: "kg",
    basePrice: 15.7,
    image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=80"
  }
];

const seafoodTemplates: ProductTemplate[] = [
  {
    name: "Atún rojo lomo",
    description: "Corte para tataki, plancha o guiso marinero.",
    unit: "kg",
    basePrice: 31.5,
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Merluza nacional",
    description: "Pescado blanco de alta rotación en cocina.",
    unit: "kg",
    basePrice: 18.2,
    image: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Gamba blanca",
    description: "Marisco para arroces y platos principales.",
    unit: "kg",
    basePrice: 28.6,
    image: "https://images.unsplash.com/photo-1565680018434-b513d13c81f1?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Cigala mediana",
    description: "Formato horeca para parrilla y plancha.",
    unit: "kg",
    basePrice: 42.9,
    image: "https://images.unsplash.com/photo-1610362791624-9f5f77b95ad9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Calamar limpio",
    description: "Preparado para freír o saltear.",
    unit: "kg",
    basePrice: 19.8,
    image: "https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Boquerón grande",
    description: "Selección para fritura andaluza.",
    unit: "kg",
    basePrice: 9.9,
    image: "https://images.unsplash.com/photo-1611175694984-0f6f617b8e52?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Pulpo troceado",
    description: "Formato cocción rápida para tapas.",
    unit: "kg",
    basePrice: 23.9,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Salmón superior",
    description: "Lomos para horno, plancha y poke.",
    unit: "kg",
    basePrice: 17.6,
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=1200&q=80"
  }
];

const produceTemplates: ProductTemplate[] = [
  {
    name: "Tomate pera selección",
    description: "Ideal para salsas, sofritos y ensalada.",
    unit: "kg",
    basePrice: 2.4,
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Lechuga romana",
    description: "Caja de hojas frescas para pase y emplatado.",
    unit: "piece",
    basePrice: 1.3,
    image: "https://images.unsplash.com/photo-1622205313162-be1d5712a43d?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Patata nueva",
    description: "Formato cocina para freír y guarnición.",
    unit: "kg",
    basePrice: 1.8,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Aguacate hass",
    description: "Maduración controlada para carta diaria.",
    unit: "kg",
    basePrice: 4.7,
    image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Pimiento rojo",
    description: "Pieza fresca para horno, plancha y sofrito.",
    unit: "kg",
    basePrice: 2.9,
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Calabacín",
    description: "Selección uniforme para cocina de volumen.",
    unit: "kg",
    basePrice: 2.5,
    image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Fresa premium",
    description: "Fruta para postres y desayunos.",
    unit: "kg",
    basePrice: 5.8,
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Naranja de mesa",
    description: "Pieza para zumo y cocina cítrica.",
    unit: "kg",
    basePrice: 2.1,
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=1200&q=80"
  }
];

const providerSpecialties: Record<string, ProductTemplate[]> = {
  "CARNICERÍA EL ORIGEN": [
    {
      name: "Lomo alto dry-aged 45 días",
      description: "Maduración controlada para cortes de firma.",
      unit: "kg",
      basePrice: 48.9,
      image: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  "Pescadería La Almadraba Sevilla": [
    {
      name: "Ventresca de atún rojo",
      description: "Corte premium de almadraba para platos especiales.",
      unit: "kg",
      basePrice: 39.5,
      image: "https://images.unsplash.com/photo-1603046891744-76e6481c6d88?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  "PESCADERÍA CABO TRAFALGAR": [
    {
      name: "Urta de litoral",
      description: "Pieza fresca para horno y guisos marineros.",
      unit: "kg",
      basePrice: 24.8,
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  "Mercado de Feria": [
    {
      name: "Pack temporada chef",
      description: "Selección mixta de verduras para menú semanal.",
      unit: "piece",
      basePrice: 18.5,
      image: "https://images.unsplash.com/photo-1467019972079-a273e1bc9173?auto=format&fit=crop&w=1200&q=80"
    }
  ],
  "Mercado de Triana": [
    {
      name: "Cesta mercado mixto",
      description: "Combinado de producto fresco de puestos tradicionales.",
      unit: "piece",
      basePrice: 26.9,
      image: "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=1200&q=80"
    }
  ]
};

function createProviderId(index: number) {
  return `90000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`;
}

function createProductId(index: number) {
  return `a0000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`;
}

function rotateTemplates(templates: ProductTemplate[], offset: number, count: number) {
  return new Array(count).fill(0).map((_, idx) => templates[(offset + idx) % templates.length]);
}

function buildProductsForProvider(seed: ProviderSeed, providerId: string, providerIndex: number): DemoProduct[] {
  const items: DemoProduct[] = [];
  let productIndexSeed = providerIndex * 100;

  const byCategory: Record<CategoryCode, ProductTemplate[]> = {
    meat: meatTemplates,
    seafood: seafoodTemplates,
    produce: produceTemplates
  };

  seed.categories.forEach((category, categoryIndex) => {
    const templates = rotateTemplates(byCategory[category], providerIndex + categoryIndex, 4);
    templates.forEach((template, templateIndex) => {
      const priceBump = seed.rating >= 4.8 ? 1.05 : seed.rating <= 3.9 ? 0.92 : 1;
      const productPrice = Number((template.basePrice * priceBump + templateIndex * 0.15).toFixed(2));

      items.push({
        id: createProductId(productIndexSeed),
        producer_id: providerId,
        category_code: category,
        name: template.name,
        description: `${template.description} · ${seed.name}`,
        unit: template.unit,
        base_price_eur: productPrice,
        image_url: template.image,
        featured: templateIndex === 0
      });
      productIndexSeed += 1;
    });
  });

  const specialties = providerSpecialties[seed.name] ?? [];
  specialties.forEach((template) => {
    const category =
      seed.categories.includes("meat") && template.name.toLowerCase().includes("lomo")
        ? "meat"
        : seed.categories.includes("seafood")
          ? "seafood"
          : seed.categories[0];

    items.push({
      id: createProductId(productIndexSeed),
      producer_id: providerId,
      category_code: category,
      name: template.name,
      description: `${template.description} · Especialidad ${seed.name}`,
      unit: template.unit,
      base_price_eur: template.basePrice,
      image_url: template.image,
      featured: true
    });
    productIndexSeed += 1;
  });

  return items;
}

export const demoProviders: DemoProvider[] = providerSeeds.map((seed, index) => {
  const id = createProviderId(index);
  return {
    id,
    name: seed.name,
    city: "Sevilla",
    neighborhood: seed.neighborhood,
    rating: seed.rating,
    categories: seed.categories,
    deliveryFeeEur: seed.deliveryFeeEur,
    etaMin: seed.etaMin,
    etaMax: seed.etaMax,
    distanceKm: seed.distanceKm,
    cardImage: seed.cardImage,
    heroImage: seed.heroImage,
    tagline: seed.tagline,
    products: buildProductsForProvider(seed, id, index)
  };
});

export const demoProviderById = Object.fromEntries(demoProviders.map((provider) => [provider.id, provider]));

const allDemoProducts = demoProviders.flatMap((provider) => provider.products);
const demoProductByIdMap = Object.fromEntries(allDemoProducts.map((product) => [product.id, product]));

export function getDemoProviderById(providerId: string) {
  return demoProviderById[providerId] ?? null;
}

export function getDemoProductById(productId: string) {
  return demoProductByIdMap[productId] ?? null;
}

export function getDemoProducerCardsByCategory(categoryCode: CategoryCode) {
  return demoProviders
    .filter((provider) => provider.categories.includes(categoryCode))
    .sort((a, b) => b.rating - a.rating)
    .map((provider) => ({
      id: provider.id,
      name: provider.name,
      city: provider.city,
      rating: provider.rating,
      distanceKm: provider.distanceKm,
      deliveryFeeEur: provider.deliveryFeeEur,
      etaMin: provider.etaMin,
      etaMax: provider.etaMax,
      tagline: provider.tagline,
      cardImage: provider.cardImage
    }));
}

export function getFeaturedDemoProviders(limit = 8) {
  return [...demoProviders].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function getDemoDeliveryWindows(providerId: string) {
  const provider = getDemoProviderById(providerId);
  const baseStart = provider?.etaMin && provider.etaMin < 20 ? "05:30" : "06:00";
  const baseEnd = provider?.etaMax && provider.etaMax > 35 ? "09:00" : "08:00";

  return [
    {
      id: `demo-window-${providerId}-am`,
      day_of_week: 1,
      start_time: baseStart,
      end_time: baseEnd,
      same_day_allowed: true,
      next_day_allowed: true
    },
    {
      id: `demo-window-${providerId}-md`,
      day_of_week: 2,
      start_time: "11:00",
      end_time: "13:00",
      same_day_allowed: true,
      next_day_allowed: true
    }
  ];
}

export function getDemoVehicleProfiles(organizationId: string) {
  return [
    {
      id: `demo-vehicle-${organizationId}-electric-1`,
      label: "Furgoneta eléctrica urbana",
      is_electric: true,
      weight_kg: 2800,
      height_cm: 205
    },
    {
      id: `demo-vehicle-${organizationId}-hybrid-1`,
      label: "Furgón híbrido refrigerado",
      is_electric: true,
      weight_kg: 3200,
      height_cm: 215
    }
  ];
}

export function getDemoContract(restaurantId: string | null | undefined, producerId: string | null | undefined) {
  if (!producerId) return null;
  return {
    id: `demo-contract-${producerId}`,
    status: "active",
    current_version: 1,
    producer_organization_id: producerId,
    restaurant_organization_id: restaurantId ?? "demo-restaurant"
  };
}

export function getDemoProviderImage(producerId: string, type: "card" | "hero") {
  const provider = getDemoProviderById(producerId);
  if (!provider) return null;
  return type === "card" ? provider.cardImage : provider.heroImage;
}
