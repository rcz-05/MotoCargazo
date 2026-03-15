import type { AppImageSource } from "./imageSources";

export type DemoCategoryCode = "meat" | "seafood" | "produce";
export type DemoMediaSource = AppImageSource;

type ProviderMediaKind = DemoCategoryCode | "mixed";

export const sevilleProviderNames = [
  "Mercado de Feria",
  "Pescados y Mariscos Javi",
  "Pescadería Maldonado",
  "Pescados y mariscos Soruco",
  "Carniceria El Bierzo",
  "Mercado de la Encarnación",
  "Marisquería La Mar de Fresquita",
  "CARNICERÍA EL ORIGEN",
  "Carnicería Almansa",
  "Pescadería La Almadraba Sevilla",
  "Mercado del Arenal",
  "Mercado de Triana",
  "Mercado Puerta De La Carne",
  "Mercado de Los Remedios",
  "Mercado San Gonzalo",
  "La Carniceria El Tardón",
  "Carniceria Esteban Charcuteria",
  "Mercado de Abastos Tiro de Línea",
  "Carnicería Manolo Rodriguez",
  "Pescadería Loli Y Antonio",
  "Polleria - Recova gayoso",
  "Frutería Carmeli",
  "Carniceria Alfonso",
  "Pescadería La lonja de Andrés",
  "PESCADERÍA CABO TRAFALGAR"
] as const;

export type SevilleProviderName = (typeof sevilleProviderNames)[number];

const providerMeatAssets = [
  require("../assets/catalog/providers/meat/meat_01_boqueria_stand.jpg"),
  require("../assets/catalog/providers/meat/meat_02_boqueria_vendor.jpg"),
  require("../assets/catalog/providers/meat/meat_03_jamon_display.jpg"),
  require("../assets/catalog/providers/meat/meat_04_butcher_stall.jpg"),
  require("../assets/catalog/providers/meat/meat_05_feria_counter.jpg"),
  require("../assets/catalog/providers/meat/meat_06_triana_counter.jpg"),
  require("../assets/catalog/providers/meat/meat_07_antequera_butcher.jpg"),
  require("../assets/catalog/providers/meat/meat_08_boqueria_butcher_stall.jpg"),
  require("../assets/catalog/providers/meat/meat_09_mercado_paz_counter.jpg"),
  require("../assets/catalog/providers/meat/meat_10_valencia_charcuteria.jpg")
] as const;

const providerSeafoodAssets = [
  require("../assets/catalog/providers/seafood/seafood_01_boqueria_fish_1.jpg"),
  require("../assets/catalog/providers/seafood/seafood_02_boqueria_fish_2.jpg"),
  require("../assets/catalog/providers/seafood/seafood_03_boqueria_mix.jpg"),
  require("../assets/catalog/providers/seafood/seafood_04_triana_counter.jpg"),
  require("../assets/catalog/providers/seafood/seafood_05_triana_halles.jpg"),
  require("../assets/catalog/providers/seafood/seafood_06_boqueria_stall.jpg"),
  require("../assets/catalog/providers/seafood/seafood_07_triana_fish_stall.jpg"),
  require("../assets/catalog/providers/seafood/seafood_08_cadiz_market.jpg"),
  require("../assets/catalog/providers/seafood/seafood_09_andalucia_seafood.jpg"),
  require("../assets/catalog/providers/seafood/seafood_10_boqueria_fish_market.jpg")
] as const;

const providerProduceAssets = [
  require("../assets/catalog/providers/produce/produce_01_triana_stall.jpg"),
  require("../assets/catalog/providers/produce/produce_02_barcelona_fruit_a.jpg"),
  require("../assets/catalog/providers/produce/produce_03_barcelona_fruit_b.jpg"),
  require("../assets/catalog/providers/produce/produce_04_barcelona_fruit_c.jpg"),
  require("../assets/catalog/providers/produce/produce_05_spanish_veg.jpg"),
  require("../assets/catalog/providers/produce/produce_06_boqueria_stall.jpg"),
  require("../assets/catalog/providers/produce/produce_07_triana_frutas.jpg"),
  require("../assets/catalog/providers/produce/produce_08_spanish_greengrocer.jpg")
] as const;

const providerMixedAssets = [
  require("../assets/catalog/providers/mixed/mixed_01_triana_interior.jpg"),
  require("../assets/catalog/providers/mixed/mixed_02_triana_general.jpg"),
  require("../assets/catalog/providers/mixed/mixed_03_feria_general.jpg"),
  require("../assets/catalog/providers/mixed/mixed_04_feria_vendor.jpg"),
  require("../assets/catalog/providers/mixed/mixed_05_feria_hall.jpg"),
  require("../assets/catalog/providers/mixed/mixed_06_feria_halles.jpg"),
  require("../assets/catalog/providers/mixed/mixed_02_market.jpg"),
  require("../assets/catalog/providers/mixed/mixed_03_market.jpg"),
  require("../assets/catalog/providers/mixed/mixed_04_market.jpg"),
  require("../assets/catalog/providers/mixed/mixed_05_market.jpg"),
  require("../assets/catalog/providers/mixed/mixed_06_market.jpg"),
  require("../assets/catalog/providers/mixed/mixed_07_triana_interior_a.jpg"),
  require("../assets/catalog/providers/mixed/mixed_08_encarnacion_interior.jpg"),
  require("../assets/catalog/providers/mixed/mixed_09_arenal_interior.jpg"),
  require("../assets/catalog/providers/mixed/mixed_10_feria_interior.jpg")
] as const;

const [
  meatBoqueriaStand,
  meatBoqueriaVendor,
  meatBoqueriaHams,
  meatButcherStall,
  meatFeriaCounter,
  meatTrianaCounter,
  meatAntequeraButcher,
  meatBoqueriaButcherStall,
  meatMercadoPazCounter,
  meatValenciaCharcuteria
] = providerMeatAssets;

const [
  seafoodBoqueriaOne,
  seafoodBoqueriaTwo,
  seafoodBoqueriaMix,
  seafoodTrianaCounter,
  seafoodTrianaHalles,
  seafoodBoqueriaStall,
  seafoodTrianaFishStall,
  seafoodCadizMarket,
  seafoodAndaluciaSeafood,
  seafoodBoqueriaFishMarket
] = providerSeafoodAssets;

const [
  produceTrianaStall,
  produceBarcelonaA,
  produceBarcelonaB,
  produceBarcelonaC,
  produceSpanishVeg,
  produceBoqueriaStall,
  produceTrianaFrutas,
  produceSpanishGreengrocer
] = providerProduceAssets;

const [
  mixedTrianaInterior,
  mixedTrianaGeneral,
  mixedFeriaGeneral,
  mixedFeriaVendor,
  mixedFeriaHall,
  mixedFeriaHalles,
  mixedMarketA,
  mixedMarketB,
  mixedMarketC,
  mixedMarketD,
  mixedMarketE,
  mixedTrianaInteriorB,
  mixedEncarnacionInterior,
  mixedArenalInterior,
  mixedFeriaInterior
] = providerMixedAssets;

const meatStand = require("../assets/catalog/meat/meat_stand.jpg");
const meatVendor = require("../assets/catalog/meat/meat_vendor.jpg");
const jamonDisplay = require("../assets/catalog/meat/jamon_display.jpg");
const meatCoverLocal = require("../assets/catalog/meat/meat_cover_local.png");
const meatAltLocal = require("../assets/catalog/meat/meat_alt_local.png");

const seafoodCounter = require("../assets/catalog/seafood/triana_fish_counter.jpg");
const seafoodStallOne = require("../assets/catalog/seafood/fish_stall_1.jpg");
const seafoodStallTwo = require("../assets/catalog/seafood/fish_stall_2.jpg");
const seafoodMix = require("../assets/catalog/seafood/fish_seafood_mix.jpg");
const seafoodCoverLocal = require("../assets/catalog/seafood/seafood_cover_local.png");
const seafoodAltLocal = require("../assets/catalog/seafood/seafood_alt_local.png");

const produceTriana = require("../assets/catalog/produce/triana_produce.jpg");
const produceFruitOne = require("../assets/catalog/produce/boqueria_fruit_1.jpg");
const produceFruitTwo = require("../assets/catalog/produce/boqueria_fruit_2.jpg");
const produceCoverLocal = require("../assets/catalog/produce/produce_cover_local.png");
const produceAltLocal = require("../assets/catalog/produce/produce_alt_local.png");

const providerPoolByKind: Record<ProviderMediaKind, readonly DemoMediaSource[]> = {
  meat: providerMeatAssets,
  seafood: providerSeafoodAssets,
  produce: providerProduceAssets,
  mixed: providerMixedAssets
};

const meatPool = [
  meatStand,
  meatVendor,
  jamonDisplay,
  meatBoqueriaStand,
  meatBoqueriaVendor,
  meatBoqueriaHams,
  meatButcherStall,
  meatFeriaCounter,
  meatTrianaCounter,
  meatAntequeraButcher,
  meatBoqueriaButcherStall,
  meatMercadoPazCounter,
  meatValenciaCharcuteria,
  meatCoverLocal,
  meatAltLocal
] as const;

const seafoodPool = [
  seafoodCounter,
  seafoodStallOne,
  seafoodStallTwo,
  seafoodMix,
  seafoodBoqueriaOne,
  seafoodBoqueriaTwo,
  seafoodBoqueriaMix,
  seafoodTrianaCounter,
  seafoodTrianaHalles,
  seafoodBoqueriaStall,
  seafoodTrianaFishStall,
  seafoodCadizMarket,
  seafoodAndaluciaSeafood,
  seafoodBoqueriaFishMarket,
  seafoodCoverLocal,
  seafoodAltLocal
] as const;

const producePool = [
  produceTriana,
  produceFruitOne,
  produceFruitTwo,
  produceTrianaStall,
  produceBarcelonaA,
  produceBarcelonaB,
  produceBarcelonaC,
  produceSpanishVeg,
  produceBoqueriaStall,
  produceTrianaFrutas,
  produceSpanishGreengrocer,
  produceCoverLocal,
  produceAltLocal
] as const;

export const categoryCover: Record<DemoCategoryCode, DemoMediaSource> = {
  produce: produceTriana,
  seafood: seafoodCounter,
  meat: meatStand
};

export const categoryDefault: Record<DemoCategoryCode, DemoMediaSource> = {
  produce: produceFruitOne,
  seafood: seafoodStallOne,
  meat: meatVendor
};

export const productByCategory: Record<DemoCategoryCode, readonly DemoMediaSource[]> = {
  produce: producePool,
  seafood: seafoodPool,
  meat: meatPool
};

export const sevilleMap = mixedTrianaInterior;

const curatedProviderMedia: Record<SevilleProviderName, { card: DemoMediaSource; hero: DemoMediaSource }> = {
  "Mercado de Feria": { card: produceTrianaStall, hero: produceSpanishVeg },
  "Pescados y Mariscos Javi": { card: seafoodBoqueriaOne, hero: seafoodTrianaCounter },
  "Pescadería Maldonado": { card: seafoodBoqueriaStall, hero: seafoodStallTwo },
  "Pescados y mariscos Soruco": { card: seafoodBoqueriaMix, hero: seafoodTrianaHalles },
  "Carniceria El Bierzo": { card: meatBoqueriaStand, hero: meatFeriaCounter },
  "Mercado de la Encarnación": { card: mixedEncarnacionInterior, hero: mixedFeriaHall },
  "Marisquería La Mar de Fresquita": { card: seafoodMix, hero: seafoodAndaluciaSeafood },
  "CARNICERÍA EL ORIGEN": { card: meatButcherStall, hero: meatBoqueriaVendor },
  "Carnicería Almansa": { card: meatMercadoPazCounter, hero: meatTrianaCounter },
  "Pescadería La Almadraba Sevilla": { card: seafoodCadizMarket, hero: seafoodBoqueriaFishMarket },
  "Mercado del Arenal": { card: mixedArenalInterior, hero: mixedMarketC },
  "Mercado de Triana": { card: mixedTrianaInterior, hero: mixedTrianaInteriorB },
  "Mercado Puerta De La Carne": { card: mixedMarketA, hero: mixedMarketD },
  "Mercado de Los Remedios": { card: mixedMarketB, hero: mixedMarketE },
  "Mercado San Gonzalo": { card: mixedFeriaInterior, hero: mixedFeriaVendor },
  "La Carniceria El Tardón": { card: meatTrianaCounter, hero: meatButcherStall },
  "Carniceria Esteban Charcuteria": { card: meatValenciaCharcuteria, hero: jamonDisplay },
  "Mercado de Abastos Tiro de Línea": { card: mixedFeriaGeneral, hero: mixedFeriaHalles },
  "Carnicería Manolo Rodriguez": { card: meatAntequeraButcher, hero: meatStand },
  "Pescadería Loli Y Antonio": { card: seafoodTrianaFishStall, hero: seafoodCounter },
  "Polleria - Recova gayoso": { card: meatFeriaCounter, hero: meatTrianaCounter },
  "Frutería Carmeli": { card: produceTrianaFrutas, hero: produceBoqueriaStall },
  "Carniceria Alfonso": { card: meatVendor, hero: meatBoqueriaButcherStall },
  "Pescadería La lonja de Andrés": { card: seafoodBoqueriaTwo, hero: seafoodStallOne },
  "PESCADERÍA CABO TRAFALGAR": { card: seafoodBoqueriaFishMarket, hero: seafoodCadizMarket }
};

function stableHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function inferProviderMediaKind(name: string, fallbackCategory: DemoCategoryCode): ProviderMediaKind {
  const normalized = name.toLowerCase();
  if (/mercado|abastos/.test(normalized)) {
    if (/pescader[ií]a|marisc/.test(normalized)) return "seafood";
    if (/fruter[ií]a|verdur/.test(normalized)) return "produce";
    if (/carnicer[ií]a|poller/.test(normalized)) return "meat";
    return "mixed";
  }
  if (/pesc|marisc|almadraba|trafalgar/.test(normalized)) return "seafood";
  if (/frut|verdur/.test(normalized)) return "produce";
  if (/poller/.test(normalized)) return "meat";
  if (/carnicer|charcut|jam[oó]n/.test(normalized)) return "meat";
  return fallbackCategory;
}

function resolveProviderPair(
  name: string,
  fallbackCategory: DemoCategoryCode,
  neighborhood?: string,
  variantOffset = 0
) {
  const mediaKind = inferProviderMediaKind(name, fallbackCategory);
  const pool = providerPoolByKind[mediaKind];
  const fallbackPool = providerPoolByKind[fallbackCategory];
  const resolvedPool = pool.length ? pool : fallbackPool;
  const baseSeed = stableHash(`${name}|${fallbackCategory}|${neighborhood ?? ""}`);
  const cardIndex = (baseSeed + variantOffset * 7) % resolvedPool.length;
  let heroIndex = (baseSeed + Math.max(2, Math.floor(resolvedPool.length / 2)) + variantOffset * 5) % resolvedPool.length;

  if (heroIndex === cardIndex && resolvedPool.length > 1) {
    heroIndex = (cardIndex + 1) % resolvedPool.length;
  }

  return {
    card: resolvedPool[cardIndex],
    hero: resolvedPool[heroIndex]
  };
}

export const providerCard = Object.fromEntries(
  sevilleProviderNames.map((name) => [name, curatedProviderMedia[name].card])
) as Record<SevilleProviderName, DemoMediaSource>;

export const providerHero = Object.fromEntries(
  sevilleProviderNames.map((name) => [name, curatedProviderMedia[name].hero])
) as Record<SevilleProviderName, DemoMediaSource>;

export function pickCategoryImage(category: DemoCategoryCode, seed = 0) {
  const pool = productByCategory[category];
  return pool[Math.abs(seed) % pool.length];
}

export function getProviderCardImageByName(
  name: string,
  fallbackCategory: DemoCategoryCode,
  neighborhood?: string,
  variantOffset = 0
) {
  if (name in curatedProviderMedia && variantOffset === 0) {
    return curatedProviderMedia[name as SevilleProviderName].card;
  }
  return resolveProviderPair(name, fallbackCategory, neighborhood, variantOffset).card;
}

export function getProviderHeroImageByName(
  name: string,
  fallbackCategory: DemoCategoryCode,
  neighborhood?: string,
  variantOffset = 0
) {
  if (name in curatedProviderMedia && variantOffset === 0) {
    return curatedProviderMedia[name as SevilleProviderName].hero;
  }
  return resolveProviderPair(name, fallbackCategory, neighborhood, variantOffset).hero;
}

function dedupeSources(items: Array<DemoMediaSource | null | undefined>) {
  const seen = new Set<string>();
  return items.filter((item): item is DemoMediaSource => {
    if (!item) return false;
    const key = typeof item === "number" ? `asset:${item}` : JSON.stringify(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildImageFallbackChain(category: DemoCategoryCode, _primary?: DemoMediaSource | string | null) {
  const pool = productByCategory[category];
  return dedupeSources([categoryCover[category], categoryDefault[category], pool[2]]);
}
