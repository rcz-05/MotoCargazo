import {
  DemoCategoryCode,
  DemoMediaSource,
  SevilleProviderName,
  getProviderCardImageByName,
  getProviderHeroImageByName
} from "./demoMedia";
import { getProductImageFallbackSource, pickProductImageSource } from "./productImageCatalog";

export type CategoryCode = DemoCategoryCode;

export type DemoProduct = {
  id: string;
  producer_id: string;
  category_code: CategoryCode;
  name: string;
  description: string;
  unit: "kg" | "piece";
  base_price_eur: number;
  image_url: string | null;
  image_source?: DemoMediaSource | null;
  image_fallback_source?: DemoMediaSource | null;
  featured?: boolean;
  badge?: string;
};

export type DemoProvider = {
  id: string;
  name: SevilleProviderName;
  city: string;
  neighborhood: string;
  rating: number;
  categories: CategoryCode[];
  deliveryFeeEur: number;
  etaMin: number;
  etaMax: number;
  distanceKm: number;
  cardImage: string | null;
  heroImage: string | null;
  cardImageSource: DemoMediaSource;
  heroImageSource: DemoMediaSource;
  tagline: string;
  promoTag?: string;
  trustLabel?: string;
  products: DemoProduct[];
};

type ProviderSeed = {
  name: SevilleProviderName;
  rating: number;
  categories: CategoryCode[];
  neighborhood: string;
  deliveryFeeEur: number;
  etaMin: number;
  etaMax: number;
  distanceKm: number;
  tagline: string;
};

type ProductTemplate = {
  name: string;
  description: string;
  unit: "kg" | "piece";
  basePrice: number;
};

type SpecialtyTemplate = ProductTemplate & {
  category?: CategoryCode;
  badge?: string;
};

type ProviderArchetype = "carniceria" | "polleria" | "pescaderia" | "fruteria" | "mercado_mixto";

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
    tagline: "Pescado de costa con control de frescura"
  }
];

const meatTemplates: ProductTemplate[] = [
  { name: "Chuletón vaca madurada", description: "Corte premium para parrilla a alta temperatura.", unit: "kg", basePrice: 34.5 },
  { name: "Presa ibérica", description: "Ideal para plancha y acabados rápidos de servicio.", unit: "kg", basePrice: 22.9 },
  { name: "Solomillo de ternera", description: "Pieza limpia para raciones premium.", unit: "kg", basePrice: 36.2 },
  { name: "Secreto ibérico", description: "Alta infiltración para carta de brasa.", unit: "kg", basePrice: 19.4 },
  { name: "Costilla de cerdo", description: "Formato para horno y servicio de raciones.", unit: "kg", basePrice: 11.8 },
  { name: "Contramuslo de pollo limpio", description: "Deshuesado y preparado para mise en place.", unit: "kg", basePrice: 8.9 },
  { name: "Jamón ibérico cebo campo", description: "Curación larga para charcutería y tapas.", unit: "piece", basePrice: 129 },
  { name: "Carrillera de vacuno", description: "Pieza para guisos de larga cocción.", unit: "kg", basePrice: 15.7 },
  { name: "Entrecot de vaca", description: "Corte limpio para plancha con acabado rápido.", unit: "kg", basePrice: 27.9 },
  { name: "Pechuga de pollo corral", description: "Despiece uniforme para marinados de servicio.", unit: "kg", basePrice: 9.8 },
  { name: "Chuleta de cerdo duroc", description: "Pieza jugosa para brasa o horno.", unit: "kg", basePrice: 12.6 },
  { name: "Picaña de vacuno", description: "Corte noble para raciones y brasas cortas.", unit: "kg", basePrice: 25.9 },
  { name: "Aguja de vacuno", description: "Textura melosa para estofado y horno lento.", unit: "kg", basePrice: 13.4 },
  { name: "Muslo de pollo campero", description: "Formato versátil para asado y guiso.", unit: "kg", basePrice: 7.9 },
  { name: "Lomo alto de vaca", description: "Corte alto para pase premium.", unit: "kg", basePrice: 41.5 },
  { name: "Alitas de pollo marinadas", description: "Listas para freidora y acabados rápidos.", unit: "kg", basePrice: 6.9 },
  { name: "Punta de solomillo", description: "Recorte noble para tartar y bocados calientes.", unit: "kg", basePrice: 21.3 }
];

const seafoodTemplates: ProductTemplate[] = [
  { name: "Atún rojo lomo", description: "Corte para tataki, plancha o guiso marinero.", unit: "kg", basePrice: 31.5 },
  { name: "Merluza nacional", description: "Pescado blanco de alta rotación en cocina.", unit: "kg", basePrice: 18.2 },
  { name: "Gamba blanca", description: "Marisco para arroces y platos principales.", unit: "kg", basePrice: 28.6 },
  { name: "Cigala mediana", description: "Formato horeca para parrilla y plancha.", unit: "kg", basePrice: 42.9 },
  { name: "Calamar limpio", description: "Preparado para freír o saltear.", unit: "kg", basePrice: 19.8 },
  { name: "Boquerón grande", description: "Selección para fritura andaluza.", unit: "kg", basePrice: 9.9 },
  { name: "Pulpo troceado", description: "Formato cocción rápida para tapas.", unit: "kg", basePrice: 23.9 },
  { name: "Salmón superior", description: "Lomos para horno, plancha y poke.", unit: "kg", basePrice: 17.6 },
  { name: "Lubina de estero", description: "Pieza completa para pase de horno.", unit: "kg", basePrice: 16.9 },
  { name: "Dorada ración", description: "Selección homogénea para carta diaria.", unit: "kg", basePrice: 15.4 },
  { name: "Rape limpio", description: "Fileteado para calderetas y platos de cuchara.", unit: "kg", basePrice: 26.2 },
  { name: "Chipirón fresco", description: "Listo para plancha, rebozado o relleno.", unit: "kg", basePrice: 14.7 },
  { name: "Mejillón gallego", description: "Marisco de cocción rápida para tapas.", unit: "kg", basePrice: 8.8 },
  { name: "Langostino cocido", description: "Formato aperitivo y mise en place fría.", unit: "kg", basePrice: 20.9 },
  { name: "Corvina nacional", description: "Pescado firme para raciones de carta.", unit: "kg", basePrice: 24.1 },
  { name: "Bacalao desalado", description: "Lomo listo para confitado o pil pil.", unit: "kg", basePrice: 22.4 },
  { name: "Sepia limpia", description: "Textura ideal para plancha y arroz.", unit: "kg", basePrice: 13.8 }
];

const produceTemplates: ProductTemplate[] = [
  { name: "Tomate pera selección", description: "Ideal para salsas, sofritos y ensalada.", unit: "kg", basePrice: 2.4 },
  { name: "Lechuga romana", description: "Caja de hojas frescas para pase y emplatado.", unit: "piece", basePrice: 1.3 },
  { name: "Patata nueva", description: "Formato cocina para freír y guarnición.", unit: "kg", basePrice: 1.8 },
  { name: "Aguacate hass", description: "Maduración controlada para carta diaria.", unit: "kg", basePrice: 4.7 },
  { name: "Pimiento rojo", description: "Pieza fresca para horno, plancha y sofrito.", unit: "kg", basePrice: 2.9 },
  { name: "Calabacín", description: "Selección uniforme para cocina de volumen.", unit: "kg", basePrice: 2.5 },
  { name: "Fresa premium", description: "Fruta para postres y desayunos.", unit: "kg", basePrice: 5.8 },
  { name: "Naranja de mesa", description: "Pieza para zumo y cocina cítrica.", unit: "kg", basePrice: 2.1 },
  { name: "Cebolla dulce", description: "Calibre regular para guiso y mise en place.", unit: "kg", basePrice: 1.6 },
  { name: "Berenjena rayada", description: "Ideal para horno y fritura ligera.", unit: "kg", basePrice: 2.2 },
  { name: "Pepino holandés", description: "Crujiente para ensaladas y encurtidos.", unit: "kg", basePrice: 2.0 },
  { name: "Espinaca baby", description: "Hoja tierna para salteados y guarniciones.", unit: "piece", basePrice: 1.9 },
  { name: "Champiñón portobello", description: "Formato de volumen para plancha.", unit: "kg", basePrice: 4.4 },
  { name: "Manzana reineta", description: "Fruta para compota, postre y snack.", unit: "kg", basePrice: 2.8 },
  { name: "Pera conferencia", description: "Pieza de temporada para sobremesa.", unit: "kg", basePrice: 2.9 },
  { name: "Limón fino", description: "Cítrico para marinados y aderezos.", unit: "kg", basePrice: 2.2 },
  { name: "Zanahoria manojo", description: "Corte uniforme para fondos y cremas.", unit: "kg", basePrice: 1.7 },
  { name: "Rúcula fresca", description: "Hoja aromática para emplatados rápidos.", unit: "piece", basePrice: 1.6 }
];

const templatesByCategory: Record<CategoryCode, ProductTemplate[]> = {
  meat: meatTemplates,
  seafood: seafoodTemplates,
  produce: produceTemplates
};

const archetypeRequiredByCategory: Record<ProviderArchetype, Partial<Record<CategoryCode, string[]>>> = {
  carniceria: {
    meat: ["Solomillo de ternera", "Chuletón vaca madurada"]
  },
  polleria: {
    meat: ["Contramuslo de pollo limpio", "Pechuga de pollo corral", "Muslo de pollo campero", "Alitas de pollo marinadas"]
  },
  pescaderia: {
    seafood: ["Merluza nacional", "Gamba blanca"]
  },
  fruteria: {
    produce: ["Tomate pera selección", "Lechuga romana", "Patata nueva", "Naranja de mesa"]
  },
  mercado_mixto: {
    meat: ["Entrecot de vaca", "Costilla de cerdo"],
    seafood: ["Corvina nacional", "Sepia limpia"],
    produce: ["Cebolla dulce", "Pepino holandés"]
  }
};

const providerRequiredByCategory: Partial<Record<SevilleProviderName, Partial<Record<CategoryCode, string[]>>>> = {
  "Carniceria El Bierzo": { meat: ["Presa ibérica", "Lomo alto de vaca", "Chuleta de cerdo duroc", "Entrecot de vaca", "Costilla de cerdo"] },
  "CARNICERÍA EL ORIGEN": { meat: ["Lomo alto de vaca", "Picaña de vacuno", "Carrillera de vacuno", "Aguja de vacuno"] },
  "Carnicería Almansa": { meat: ["Aguja de vacuno", "Muslo de pollo campero", "Secreto ibérico", "Chuleta de cerdo duroc", "Contramuslo de pollo limpio"] },
  "La Carniceria El Tardón": { meat: ["Punta de solomillo", "Picaña de vacuno", "Secreto ibérico", "Entrecot de vaca", "Lomo alto de vaca"] },
  "Carniceria Esteban Charcuteria": { meat: ["Jamón ibérico cebo campo", "Costilla de cerdo", "Chuleta de cerdo duroc", "Presa ibérica", "Alitas de pollo marinadas"] },
  "Carnicería Manolo Rodriguez": { meat: ["Jamón ibérico cebo campo", "Entrecot de vaca", "Costilla de cerdo", "Pechuga de pollo corral", "Punta de solomillo"] },
  "Polleria - Recova gayoso": { meat: ["Contramuslo de pollo limpio", "Pechuga de pollo corral", "Alitas de pollo marinadas", "Muslo de pollo campero"] },
  "Carniceria Alfonso": { meat: ["Secreto ibérico", "Pechuga de pollo corral", "Carrillera de vacuno", "Chuleta de cerdo duroc", "Presa ibérica"] },
  "Pescados y Mariscos Javi": { seafood: ["Atún rojo lomo", "Chipirón fresco", "Pulpo troceado", "Salmón superior", "Boquerón grande"] },
  "Pescadería Maldonado": { seafood: ["Bacalao desalado", "Rape limpio", "Salmón superior", "Atún rojo lomo", "Cigala mediana"] },
  "Pescados y mariscos Soruco": { seafood: ["Langostino cocido", "Sepia limpia", "Mejillón gallego", "Calamar limpio", "Cigala mediana"] },
  "Marisquería La Mar de Fresquita": { seafood: ["Cigala mediana", "Langostino cocido", "Pulpo troceado", "Chipirón fresco", "Mejillón gallego"] },
  "Pescadería La Almadraba Sevilla": { seafood: ["Atún rojo lomo", "Corvina nacional", "Bacalao desalado", "Salmón superior", "Boquerón grande"] },
  "Pescadería Loli Y Antonio": { seafood: ["Dorada ración", "Calamar limpio", "Chipirón fresco", "Sepia limpia", "Boquerón grande"] },
  "Pescadería La lonja de Andrés": { seafood: ["Lubina de estero", "Corvina nacional", "Langostino cocido", "Pulpo troceado", "Mejillón gallego"] },
  "PESCADERÍA CABO TRAFALGAR": { seafood: ["Urta de litoral", "Corvina nacional", "Boquerón grande", "Atún rojo lomo", "Salmón superior"] },
  "Frutería Carmeli": { produce: ["Fresa premium", "Naranja de mesa", "Manzana reineta"] },
  "Mercado de Feria": { produce: ["Tomate pera selección", "Pimiento rojo", "Calabacín"] },
  "Mercado de la Encarnación": {
    meat: ["Presa ibérica", "Entrecot de vaca"],
    seafood: ["Merluza nacional", "Pulpo troceado"],
    produce: ["Tomate pera selección", "Patata nueva"]
  },
  "Mercado del Arenal": {
    meat: ["Secreto ibérico", "Costilla de cerdo"],
    seafood: ["Calamar limpio", "Gamba blanca"],
    produce: ["Lechuga romana", "Cebolla dulce"]
  },
  "Mercado de Triana": {
    meat: ["Picaña de vacuno", "Solomillo de ternera"],
    seafood: ["Atún rojo lomo", "Chipirón fresco"],
    produce: ["Calabacín", "Tomate pera selección"]
  },
  "Mercado Puerta De La Carne": {
    meat: ["Chuletón vaca madurada", "Lomo alto de vaca"],
    seafood: ["Boquerón grande", "Merluza nacional"],
    produce: ["Pimiento rojo", "Patata nueva"]
  },
  "Mercado de Los Remedios": {
    meat: ["Aguja de vacuno", "Presa ibérica"],
    seafood: ["Dorada ración", "Sepia limpia"],
    produce: ["Aguacate hass", "Pepino holandés"]
  },
  "Mercado San Gonzalo": {
    meat: ["Muslo de pollo campero", "Pechuga de pollo corral"],
    seafood: ["Bacalao desalado", "Sepia limpia"]
  },
  "Mercado de Abastos Tiro de Línea": {
    meat: ["Pechuga de pollo corral", "Secreto ibérico"],
    seafood: ["Pulpo troceado", "Merluza nacional"],
    produce: ["Zanahoria manojo", "Cebolla dulce"]
  }
};

const providerSpecialties: Partial<Record<SevilleProviderName, SpecialtyTemplate[]>> = {
  "CARNICERÍA EL ORIGEN": [
    {
      name: "Lomo alto dry-aged 45 días",
      description: "Maduración controlada para cortes de firma.",
      unit: "kg",
      basePrice: 48.9,
      category: "meat",
      badge: "Especialidad"
    }
  ],
  "Pescadería La Almadraba Sevilla": [
    {
      name: "Ventresca de atún rojo",
      description: "Corte premium de almadraba para platos especiales.",
      unit: "kg",
      basePrice: 39.5,
      category: "seafood",
      badge: "Especialidad"
    }
  ],
  "PESCADERÍA CABO TRAFALGAR": [
    {
      name: "Urta de litoral",
      description: "Pieza fresca para horno y guisos marineros.",
      unit: "kg",
      basePrice: 24.8,
      category: "seafood",
      badge: "Especialidad"
    }
  ],
  "Mercado de Feria": [
    {
      name: "Pack temporada chef",
      description: "Selección mixta de verduras para menú semanal.",
      unit: "piece",
      basePrice: 18.5,
      category: "produce",
      badge: "Especialidad"
    }
  ],
  "Mercado de Triana": [
    {
      name: "Cesta mercado mixto",
      description: "Combinado de producto fresco de puestos tradicionales.",
      unit: "piece",
      basePrice: 26.9,
      category: "produce",
      badge: "Especialidad"
    }
  ]
};

function createProviderId(index: number) {
  return `90000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`;
}

function createProductId(index: number) {
  return `a0000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`;
}

function canonicalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function getMediaSourceKey(source: DemoMediaSource | null | undefined) {
  if (!source) return null;
  return typeof source === "number" ? `asset:${source}` : JSON.stringify(source);
}

function inferFallbackCategory(categories: CategoryCode[]): CategoryCode {
  if (categories.includes("meat")) return "meat";
  if (categories.includes("seafood")) return "seafood";
  return "produce";
}

function inferProviderArchetype(seed: ProviderSeed): ProviderArchetype {
  const normalizedName = canonicalize(seed.name);
  if (seed.categories.length > 1) return "mercado_mixto";
  if (/poller/.test(normalizedName)) return "polleria";
  if (/pesc|marisc|marisq|almadraba|trafalgar|lonja/.test(normalizedName)) return "pescaderia";
  if (/frut|verdur/.test(normalizedName)) return "fruteria";
  return "carniceria";
}

function deterministicShuffle<T>(items: readonly T[], seedKey: string, valueSelector: (item: T) => string) {
  return [...items].sort((a, b) => {
    const scoreA = stableHash(`${seedKey}|${valueSelector(a)}|A`);
    const scoreB = stableHash(`${seedKey}|${valueSelector(b)}|B`);
    return scoreA - scoreB;
  });
}

function uniqueTemplates(templates: ProductTemplate[]) {
  const seen = new Set<string>();
  return templates.filter((template) => {
    const key = canonicalize(template.name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getCategoryTargets(categories: readonly CategoryCode[]) {
  if (categories.length === 1) {
    return { [categories[0]]: 8 } as Record<CategoryCode, number>;
  }

  const total = 12;
  const base = Math.floor(total / categories.length);
  const remainder = total % categories.length;
  const targets = {} as Record<CategoryCode, number>;

  categories.forEach((category, index) => {
    targets[category] = base + (index < remainder ? 1 : 0);
  });

  return targets;
}

function resolveRequiredTemplates(
  seed: ProviderSeed,
  category: CategoryCode,
  archetype: ProviderArchetype,
  categoryTemplates: ProductTemplate[]
) {
  const archetypeRequired = archetypeRequiredByCategory[archetype][category] ?? [];
  const providerRequired = providerRequiredByCategory[seed.name]?.[category] ?? [];
  const requiredNames = [...new Set([...archetypeRequired, ...providerRequired])].map(canonicalize);
  if (!requiredNames.length) return [] as ProductTemplate[];

  const byName = new Map(categoryTemplates.map((template) => [canonicalize(template.name), template]));
  return requiredNames.map((name) => byName.get(name)).filter(Boolean) as ProductTemplate[];
}

function getSpecialtiesByCategory(seed: ProviderSeed, category: CategoryCode) {
  return (providerSpecialties[seed.name] ?? []).filter((template) => (template.category ?? category) === category);
}

function resolveProductPrice(basePrice: number, seed: ProviderSeed, slotIndex: number, specialty = false) {
  if (specialty) return Number(basePrice.toFixed(2));

  const ratingFactor = seed.rating >= 4.8 ? 1.055 : seed.rating <= 3.9 ? 0.93 : 1;
  const neighborhoodBias = ((stableHash(seed.neighborhood) % 5) - 2) * 0.005;
  const slotBump = slotIndex * 0.12;
  return Number((basePrice * (ratingFactor + neighborhoodBias) + slotBump).toFixed(2));
}

function buildProductsForProvider(seed: ProviderSeed, providerId: string, providerIndex: number): DemoProduct[] {
  const items: DemoProduct[] = [];
  let productIndexSeed = providerIndex * 100;
  const archetype = inferProviderArchetype(seed);
  const categoryTargets = getCategoryTargets(seed.categories);

  seed.categories.forEach((category, categoryIndex) => {
    const categoryTemplates = templatesByCategory[category];
    const requiredTemplates = resolveRequiredTemplates(seed, category, archetype, categoryTemplates);
    const specialties = getSpecialtiesByCategory(seed, category);

    const target = categoryTargets[category];
    const baseCount = Math.max(target - specialties.length, requiredTemplates.length);

    const excludedNames = new Set(requiredTemplates.map((template) => canonicalize(template.name)));
    const optionalPool = deterministicShuffle(
      categoryTemplates.filter((template) => !excludedNames.has(canonicalize(template.name))),
      `${seed.name}|${seed.neighborhood}|${category}|${providerIndex}`,
      (template) => template.name
    );

    const selectedBase = uniqueTemplates([...requiredTemplates, ...optionalPool]).slice(0, baseCount);
    const selectedTemplates = uniqueTemplates([...selectedBase, ...specialties]).slice(0, target);

    let previousImageSource: DemoMediaSource | undefined;

    selectedTemplates.forEach((template, templateIndex) => {
      const isSpecialty = specialties.some((specialty) => canonicalize(specialty.name) === canonicalize(template.name));
      const imageSource = pickProductImageSource({
        name: template.name,
        category,
        providerSeed: providerIndex + categoryIndex * 5,
        slotSeed: categoryIndex * 20 + templateIndex,
        avoidSources: previousImageSource ? [previousImageSource] : []
      });
      const imageFallbackSource = getProductImageFallbackSource(template.name, category);

      items.push({
        id: createProductId(productIndexSeed),
        producer_id: providerId,
        category_code: category,
        name: template.name,
        description: template.description,
        unit: template.unit,
        base_price_eur: resolveProductPrice(template.basePrice, seed, templateIndex, isSpecialty),
        image_url: null,
        image_source: imageSource,
        image_fallback_source: imageFallbackSource,
        featured: templateIndex === 0 || isSpecialty,
        badge: isSpecialty ? "Especialidad" : templateIndex === 0 ? "Top ventas" : undefined
      });

      previousImageSource = imageSource ?? undefined;
      productIndexSeed += 1;
    });
  });

  return items;
}

export const demoProviders: DemoProvider[] = providerSeeds.map((seed, index) => {
  const id = createProviderId(index);
  const fallbackCategory = inferFallbackCategory(seed.categories);

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
    cardImage: null,
    heroImage: null,
    cardImageSource: getProviderCardImageByName(seed.name, fallbackCategory, seed.neighborhood),
    heroImageSource: getProviderHeroImageByName(seed.name, fallbackCategory, seed.neighborhood),
    tagline: seed.tagline,
    promoTag: seed.rating >= 4.8 ? "Premium Sevilla" : seed.rating <= 4.0 ? "Oferta del día" : "Entrega express",
    trustLabel: seed.rating >= 4.6 ? "Alta fiabilidad" : "Proveedor verificado",
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
  const filtered = demoProviders
    .filter((provider) => provider.categories.includes(categoryCode))
    .sort((a, b) => b.rating - a.rating);

  const usedImages = new Set<string>();

  return filtered.map((provider) => {
    let cardImageSource = provider.cardImageSource;
    let cardImage = provider.cardImage;
    let sourceKey = getMediaSourceKey(cardImageSource);

    if (sourceKey && usedImages.has(sourceKey)) {
      for (let variant = 1; variant <= 12; variant += 1) {
        const candidate = getProviderCardImageByName(provider.name, categoryCode, provider.neighborhood, variant);
        const candidateKey = getMediaSourceKey(candidate);
        if (candidateKey && !usedImages.has(candidateKey)) {
          cardImageSource = candidate;
          sourceKey = candidateKey;
          break;
        }
      }
    }

    if (sourceKey) {
      usedImages.add(sourceKey);
    }

    return {
      id: provider.id,
      name: provider.name,
      city: provider.city,
      rating: provider.rating,
      distanceKm: provider.distanceKm,
      deliveryFeeEur: provider.deliveryFeeEur,
      etaMin: provider.etaMin,
      etaMax: provider.etaMax,
      tagline: provider.tagline,
      cardImage,
      cardImageSource
    };
  });
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
  return type === "card" ? provider.cardImageSource : provider.heroImageSource;
}
