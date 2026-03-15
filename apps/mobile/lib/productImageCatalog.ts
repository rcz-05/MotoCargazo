import { DemoCategoryCode, DemoMediaSource } from "./demoMedia";

type ProductImagePickInput = {
  name: string;
  category: DemoCategoryCode;
  providerSeed?: number;
  slotSeed?: number;
  avoidSources?: readonly DemoMediaSource[];
};

type ProductImageAssets = Record<string, readonly DemoMediaSource[]>;

type MeatSubtype = "beef" | "pork" | "chicken" | "cured";
type SeafoodSubtype = "white_fish" | "blue_fish" | "shellfish" | "cephalopod";
type ProduceSubtype = "leafy" | "root" | "fruit" | "citrus";

const meatStand = require("../assets/catalog/meat/meat_stand.jpg");
const meatVendor = require("../assets/catalog/meat/meat_vendor.jpg");
const jamonDisplay = require("../assets/catalog/meat/jamon_display.jpg");
const meatCoverLocal = require("../assets/catalog/meat/meat_cover_local.png");
const meatAltLocal = require("../assets/catalog/meat/meat_alt_local.png");
const meatBoqueriaStand = require("../assets/catalog/providers/meat/meat_01_boqueria_stand.jpg");
const meatBoqueriaVendor = require("../assets/catalog/providers/meat/meat_02_boqueria_vendor.jpg");
const meatBoqueriaHams = require("../assets/catalog/providers/meat/meat_03_jamon_display.jpg");
const meatButcherStall = require("../assets/catalog/providers/meat/meat_04_butcher_stall.jpg");
const meatFeriaCounter = require("../assets/catalog/providers/meat/meat_05_feria_counter.jpg");
const meatTrianaCounter = require("../assets/catalog/providers/meat/meat_06_triana_counter.jpg");
const meatAntequeraButcher = require("../assets/catalog/providers/meat/meat_07_antequera_butcher.jpg");
const meatBoqueriaButcherStall = require("../assets/catalog/providers/meat/meat_08_boqueria_butcher_stall.jpg");
const meatMercadoPazCounter = require("../assets/catalog/providers/meat/meat_09_mercado_paz_counter.jpg");
const meatValenciaCharcuteria = require("../assets/catalog/providers/meat/meat_10_valencia_charcuteria.jpg");

const seafoodCounter = require("../assets/catalog/seafood/triana_fish_counter.jpg");
const seafoodStallOne = require("../assets/catalog/seafood/fish_stall_1.jpg");
const seafoodStallTwo = require("../assets/catalog/seafood/fish_stall_2.jpg");
const seafoodMix = require("../assets/catalog/seafood/fish_seafood_mix.jpg");
const seafoodCoverLocal = require("../assets/catalog/seafood/seafood_cover_local.png");
const seafoodAltLocal = require("../assets/catalog/seafood/seafood_alt_local.png");
const seafoodBoqueriaOne = require("../assets/catalog/providers/seafood/seafood_01_boqueria_fish_1.jpg");
const seafoodBoqueriaTwo = require("../assets/catalog/providers/seafood/seafood_02_boqueria_fish_2.jpg");
const seafoodBoqueriaMix = require("../assets/catalog/providers/seafood/seafood_03_boqueria_mix.jpg");
const seafoodTrianaCounter = require("../assets/catalog/providers/seafood/seafood_04_triana_counter.jpg");
const seafoodTrianaHalles = require("../assets/catalog/providers/seafood/seafood_05_triana_halles.jpg");
const seafoodBoqueriaStall = require("../assets/catalog/providers/seafood/seafood_06_boqueria_stall.jpg");
const seafoodTrianaFishStall = require("../assets/catalog/providers/seafood/seafood_07_triana_fish_stall.jpg");
const seafoodCadizMarket = require("../assets/catalog/providers/seafood/seafood_08_cadiz_market.jpg");
const seafoodAndaluciaSeafood = require("../assets/catalog/providers/seafood/seafood_09_andalucia_seafood.jpg");
const seafoodBoqueriaFishMarket = require("../assets/catalog/providers/seafood/seafood_10_boqueria_fish_market.jpg");

const produceTriana = require("../assets/catalog/produce/triana_produce.jpg");
const produceFruitOne = require("../assets/catalog/produce/boqueria_fruit_1.jpg");
const produceFruitTwo = require("../assets/catalog/produce/boqueria_fruit_2.jpg");
const produceCoverLocal = require("../assets/catalog/produce/produce_cover_local.png");
const produceAltLocal = require("../assets/catalog/produce/produce_alt_local.png");
const produceTrianaStall = require("../assets/catalog/providers/produce/produce_01_triana_stall.jpg");
const produceBarcelonaA = require("../assets/catalog/providers/produce/produce_02_barcelona_fruit_a.jpg");
const produceBarcelonaB = require("../assets/catalog/providers/produce/produce_03_barcelona_fruit_b.jpg");
const produceBarcelonaC = require("../assets/catalog/providers/produce/produce_04_barcelona_fruit_c.jpg");
const produceSpanishVeg = require("../assets/catalog/providers/produce/produce_05_spanish_veg.jpg");
const produceBoqueriaStall = require("../assets/catalog/providers/produce/produce_06_boqueria_stall.jpg");

const categoryAssetPool: Record<DemoCategoryCode, readonly DemoMediaSource[]> = {
  meat: [
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
  ],
  seafood: [
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
  ],
  produce: [
    produceTriana,
    produceFruitOne,
    produceFruitTwo,
    produceTrianaStall,
    produceBarcelonaA,
    produceBarcelonaB,
    produceBarcelonaC,
    produceSpanishVeg,
    produceBoqueriaStall,
    produceCoverLocal,
    produceAltLocal
  ]
};

const meatSubtypeAssets: Record<MeatSubtype, readonly DemoMediaSource[]> = {
  beef: [meatStand, meatVendor, meatButcherStall, meatTrianaCounter, meatBoqueriaStand, meatAntequeraButcher, meatBoqueriaButcherStall, meatMercadoPazCounter],
  pork: [meatBoqueriaVendor, meatBoqueriaStand, meatFeriaCounter, meatVendor, meatAntequeraButcher, meatMercadoPazCounter],
  chicken: [meatFeriaCounter, meatTrianaCounter, meatStand, meatCoverLocal, meatBoqueriaButcherStall, meatAntequeraButcher],
  cured: [jamonDisplay, meatBoqueriaHams, meatBoqueriaVendor, meatAltLocal, meatValenciaCharcuteria]
};

const seafoodSubtypeAssets: Record<SeafoodSubtype, readonly DemoMediaSource[]> = {
  white_fish: [seafoodStallTwo, seafoodCounter, seafoodTrianaCounter, seafoodBoqueriaStall, seafoodTrianaFishStall, seafoodCadizMarket],
  blue_fish: [seafoodStallOne, seafoodCounter, seafoodBoqueriaOne, seafoodBoqueriaTwo, seafoodBoqueriaFishMarket, seafoodCadizMarket],
  shellfish: [seafoodMix, seafoodBoqueriaMix, seafoodTrianaHalles, seafoodBoqueriaTwo, seafoodAndaluciaSeafood, seafoodTrianaFishStall],
  cephalopod: [seafoodStallOne, seafoodMix, seafoodBoqueriaOne, seafoodBoqueriaMix, seafoodBoqueriaFishMarket, seafoodAndaluciaSeafood]
};

const produceSubtypeAssets: Record<ProduceSubtype, readonly DemoMediaSource[]> = {
  leafy: [produceTrianaStall, produceTriana, produceSpanishVeg, produceCoverLocal],
  root: [produceSpanishVeg, produceBoqueriaStall, produceTriana, produceAltLocal],
  fruit: [produceBarcelonaA, produceBarcelonaB, produceBarcelonaC, produceFruitTwo],
  citrus: [produceFruitOne, produceBarcelonaB, produceBarcelonaC, produceBoqueriaStall]
};

const productSpecificAssets: ProductImageAssets = {
  "chuleton vaca madurada": [meatStand, meatVendor],
  "presa iberica": [meatBoqueriaVendor, meatFeriaCounter],
  "solomillo de ternera": [meatVendor, meatButcherStall],
  "secreto iberico": [meatBoqueriaStand, meatVendor],
  "costilla de cerdo": [meatBoqueriaStand, meatFeriaCounter],
  "contramuslo de pollo limpio": [meatFeriaCounter, meatTrianaCounter],
  "jamon iberico cebo campo": [jamonDisplay, meatBoqueriaHams],
  "carrillera de vacuno": [meatStand, meatButcherStall],
  "lomo alto dry aged 45 dias": [meatVendor, meatBoqueriaVendor],
  "entrecot de vaca": [meatStand, meatVendor],
  "pechuga de pollo corral": [meatTrianaCounter, meatFeriaCounter],
  "chuleta de cerdo duroc": [meatBoqueriaStand, meatFeriaCounter],
  "picana de vacuno": [meatButcherStall, meatVendor],
  "aguja de vacuno": [meatStand, meatTrianaCounter],
  "muslo de pollo campero": [meatTrianaCounter, meatCoverLocal],
  "lomo alto de vaca": [meatVendor, meatStand],
  "alitas de pollo marinadas": [meatFeriaCounter, meatAltLocal],
  "punta de solomillo": [meatButcherStall, meatStand],

  "atun rojo lomo": [seafoodBoqueriaOne, seafoodStallOne],
  "merluza nacional": [seafoodStallTwo, seafoodCounter],
  "gamba blanca": [seafoodMix, seafoodBoqueriaMix],
  "cigala mediana": [seafoodMix, seafoodTrianaHalles],
  "calamar limpio": [seafoodStallOne, seafoodBoqueriaStall],
  "boqueron grande": [seafoodStallTwo, seafoodCounter],
  "pulpo troceado": [seafoodBoqueriaMix, seafoodMix],
  "salmon superior": [seafoodBoqueriaOne, seafoodCounter],
  "ventresca de atun rojo": [seafoodBoqueriaOne, seafoodStallOne],
  "urta de litoral": [seafoodCounter, seafoodStallTwo],
  "lubina de estero": [seafoodStallTwo, seafoodTrianaCounter],
  "dorada racion": [seafoodTrianaCounter, seafoodStallTwo],
  "rape limpio": [seafoodBoqueriaStall, seafoodCounter],
  "chipiron fresco": [seafoodStallOne, seafoodBoqueriaOne],
  "mejillon gallego": [seafoodMix, seafoodBoqueriaMix],
  "langostino cocido": [seafoodMix, seafoodTrianaHalles],
  "corvina nacional": [seafoodStallTwo, seafoodBoqueriaStall],
  "bacalao desalado": [seafoodCounter, seafoodStallOne],
  "sepia limpia": [seafoodBoqueriaOne, seafoodStallOne],

  "tomate pera seleccion": [produceTriana, produceTrianaStall],
  "lechuga romana": [produceTrianaStall, produceCoverLocal],
  "patata nueva": [produceSpanishVeg, produceTriana],
  "aguacate hass": [produceFruitTwo, produceBarcelonaA],
  "pimiento rojo": [produceBarcelonaA, produceTriana],
  "calabacin": [produceTrianaStall, produceAltLocal],
  "fresa premium": [produceBarcelonaB, produceFruitTwo],
  "naranja de mesa": [produceFruitOne, produceBarcelonaC],
  "pack temporada chef": [produceTrianaStall, produceBoqueriaStall],
  "cesta mercado mixto": [produceBoqueriaStall, produceTriana],
  "cebolla dulce": [produceSpanishVeg, produceTriana],
  "berenjena rayada": [produceTrianaStall, produceSpanishVeg],
  "pepino holandes": [produceBoqueriaStall, produceTriana],
  "espinaca baby": [produceTrianaStall, produceCoverLocal],
  "champinon portobello": [produceSpanishVeg, produceAltLocal],
  "manzana reineta": [produceBarcelonaA, produceBarcelonaB],
  "pera conferencia": [produceBarcelonaB, produceBarcelonaC],
  "limon fino": [produceFruitOne, produceBarcelonaC],
  "zanahoria manojo": [produceSpanishVeg, produceTriana],
  "rucula fresca": [produceTrianaStall, produceCoverLocal]
};

const subtypePool = {
  meat: meatSubtypeAssets,
  seafood: seafoodSubtypeAssets,
  produce: produceSubtypeAssets
};

function canonicalizeProductName(value: string) {
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
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function dedupeCandidates(candidates: readonly DemoMediaSource[]) {
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    const key = typeof candidate === "number" ? `asset:${candidate}` : JSON.stringify(candidate);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function inferMeatSubtype(name: string): MeatSubtype {
  if (/(pollo|muslo|contramuslo|pechuga|alitas)/.test(name)) return "chicken";
  if (/(jamon|charcut|iberic|duroc|cerdo|secreto|presa|costilla)/.test(name)) return "pork";
  if (/(curad|embut|cebo)/.test(name)) return "cured";
  return "beef";
}

function inferSeafoodSubtype(name: string): SeafoodSubtype {
  if (/(gamba|cigala|langost|mejillon|marisc)/.test(name)) return "shellfish";
  if (/(calamar|pulpo|sepia|chipiron)/.test(name)) return "cephalopod";
  if (/(atun|boqueron|salmon|caballa|sard)/.test(name)) return "blue_fish";
  return "white_fish";
}

function inferProduceSubtype(name: string): ProduceSubtype {
  if (/(lechuga|espinaca|rucula)/.test(name)) return "leafy";
  if (/(patata|cebolla|zanahoria|champinon|calabacin|berenjena|pepino)/.test(name)) return "root";
  if (/(naranja|limon)/.test(name)) return "citrus";
  return "fruit";
}

function getSubtypeCandidates(category: DemoCategoryCode, canonicalName: string) {
  if (category === "meat") {
    return subtypePool.meat[inferMeatSubtype(canonicalName)];
  }
  if (category === "seafood") {
    return subtypePool.seafood[inferSeafoodSubtype(canonicalName)];
  }
  return subtypePool.produce[inferProduceSubtype(canonicalName)];
}

export function getProductImageCandidates(
  name: string,
  category: DemoCategoryCode,
  options?: { includeCategoryFallback?: boolean }
) {
  const canonicalName = canonicalizeProductName(name);
  const specific = productSpecificAssets[canonicalName] ?? [];
  const subtypeCandidates = getSubtypeCandidates(category, canonicalName);
  const categoryFallback = options?.includeCategoryFallback === false ? [] : categoryAssetPool[category];
  return dedupeCandidates([...specific, ...subtypeCandidates, ...categoryFallback]);
}

export function getProductImageFallbackSource(name: string, category: DemoCategoryCode) {
  const exactCandidates = getProductImageCandidates(name, category, { includeCategoryFallback: false });
  if (exactCandidates.length > 1) return exactCandidates[1];

  const fallbackCandidates = getProductImageCandidates(name, category, { includeCategoryFallback: true });
  return fallbackCandidates[1] ?? null;
}

export function pickProductImageSource({
  name,
  category,
  providerSeed = 0,
  slotSeed = 0,
  avoidSources = []
}: ProductImagePickInput) {
  const preferred = getProductImageCandidates(name, category, { includeCategoryFallback: false });
  const candidates = preferred.length ? preferred : getProductImageCandidates(name, category, { includeCategoryFallback: true });
  if (!candidates.length) return null;

  const canonicalName = canonicalizeProductName(name);
  const seed = stableHash(canonicalName) + providerSeed * 23 + slotSeed * 11;
  const start = Math.abs(seed) % candidates.length;
  const avoid = new Set(
    avoidSources
      .filter(Boolean)
      .map((source) => (typeof source === "number" ? `asset:${source}` : JSON.stringify(source)))
  );

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[(start + index) % candidates.length];
    const key = typeof candidate === "number" ? `asset:${candidate}` : JSON.stringify(candidate);
    if (!avoid.has(key)) {
      return candidate;
    }
  }

  return candidates[start];
}
