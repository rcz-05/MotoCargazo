import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const nodeRequire = createRequire(import.meta.url);

const moduleCache = new Map();

function resolveTsModule(specifier, fromDir) {
  const absoluteBase = specifier.startsWith("/") ? specifier : path.resolve(fromDir, specifier);
  const candidates = [
    absoluteBase,
    `${absoluteBase}.ts`,
    `${absoluteBase}.tsx`,
    `${absoluteBase}.js`,
    `${absoluteBase}.mjs`,
    path.join(absoluteBase, "index.ts"),
    path.join(absoluteBase, "index.tsx"),
    path.join(absoluteBase, "index.js")
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  throw new Error(`Unable to resolve module "${specifier}" from "${fromDir}"`);
}

function createReactNativeShim() {
  return {
    Image: {
      resolveAssetSource(asset) {
        const normalized = String(asset).replace(/^\.+\//, "");
        return { uri: `asset://${normalized}` };
      }
    }
  };
}

function executeTsModule(absolutePath) {
  if (moduleCache.has(absolutePath)) {
    return moduleCache.get(absolutePath).exports;
  }

  const source = fs.readFileSync(absolutePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.React
    },
    fileName: absolutePath
  }).outputText;

  const localModule = { exports: {} };
  moduleCache.set(absolutePath, localModule);

  const localRequire = (specifier) => {
    if (specifier === "react-native") {
      return createReactNativeShim();
    }

    if (/\.(png|jpe?g|webp|gif|svg)$/i.test(specifier)) {
      return specifier;
    }

    if (specifier.startsWith(".")) {
      const resolved = resolveTsModule(specifier, path.dirname(absolutePath));
      return executeTsModule(resolved);
    }

    return nodeRequire(specifier);
  };

  const wrapped = new Function("require", "module", "exports", "__filename", "__dirname", transpiled);
  wrapped(localRequire, localModule, localModule.exports, absolutePath, path.dirname(absolutePath));

  return localModule.exports;
}

function canonicalize(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferArchetypeFromName(name) {
  const normalized = canonicalize(name);
  if (/mercado|abastos/.test(normalized)) return "mercado";
  if (/pesc|marisc|marisq|almadraba|trafalgar|lonja/.test(normalized)) return "seafood";
  if (/frut|verdur/.test(normalized)) return "produce";
  if (/poller/.test(normalized)) return "poultry";
  return "meat";
}

function mediaKey(value) {
  if (!value) return null;
  if (typeof value === "number") return `asset:${value}`;
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

const demoCatalogPath = path.resolve(repoRoot, "apps/mobile/lib/demoCatalog.ts");
const { demoProviders, getDemoProducerCardsByCategory } = executeTsModule(demoCatalogPath);

const categories = ["meat", "seafood", "produce"];
const failures = [];
const sharedStaplesByCategory = {
  meat: new Set(
    [
      "solomillo de ternera",
      "presa iberica",
      "secreto iberico",
      "entrecot de vaca",
      "costilla de cerdo",
      "chuleta de cerdo duroc",
      "muslo de pollo campero",
      "pechuga de pollo corral"
    ].map(canonicalize)
  ),
  seafood: new Set(
    [
      "merluza nacional",
      "atun rojo lomo",
      "gamba blanca",
      "calamar limpio",
      "boqueron grande",
      "corvina nacional",
      "sepia limpia",
      "bacalao desalado"
    ].map(canonicalize)
  ),
  produce: new Set(
    ["tomate pera seleccion", "patata nueva", "lechuga romana", "pimiento rojo", "cebolla dulce", "pepino holandes"].map(
      canonicalize
    )
  )
};

for (const category of categories) {
  const cards = getDemoProducerCardsByCategory(category);
  for (let index = 1; index < cards.length; index += 1) {
    const prev = cards[index - 1];
    const curr = cards[index];
    if (mediaKey(prev.cardImageSource ?? prev.cardImage) === mediaKey(curr.cardImageSource ?? curr.cardImage)) {
      failures.push(
        `[adjacent-provider-image:${category}] ${prev.name} and ${curr.name} share the same card image in adjacent slots`
      );
    }
  }
}

for (const provider of demoProviders) {
  const grouped = new Map();

  for (const product of provider.products) {
    const bucket = grouped.get(product.category_code) ?? [];
    bucket.push(product);
    grouped.set(product.category_code, bucket);
  }

  for (const [category, products] of grouped.entries()) {
    for (let index = 1; index < products.length; index += 1) {
      const prev = products[index - 1];
      const curr = products[index];
      if (
        mediaKey(prev.image_source ?? prev.image_url) === mediaKey(curr.image_source ?? curr.image_url) &&
        canonicalize(prev.name) !== canonicalize(curr.name)
      ) {
        failures.push(
          `[adjacent-product-image:${provider.name}/${category}] "${prev.name}" and "${curr.name}" share the same image in adjacent rows`
        );
      }
    }
  }
}

for (const category of categories) {
  const providers = demoProviders.filter((provider) => provider.categories.includes(category));
  for (let a = 0; a < providers.length; a += 1) {
    for (let b = a + 1; b < providers.length; b += 1) {
      const left = providers[a];
      const right = providers[b];

      const leftSet = new Set(
        left.products
          .filter((product) => product.category_code === category)
          .map((product) => canonicalize(product.name))
          .filter((name) => !sharedStaplesByCategory[category].has(name))
      );
      const rightSet = new Set(
        right.products
          .filter((product) => product.category_code === category)
          .map((product) => canonicalize(product.name))
          .filter((name) => !sharedStaplesByCategory[category].has(name))
      );

      const union = new Set([...leftSet, ...rightSet]);
      if (union.size < 3) continue;
      let intersectionCount = 0;

      for (const name of leftSet) {
        if (rightSet.has(name)) {
          intersectionCount += 1;
        }
      }

      const overlap = union.size ? intersectionCount / union.size : 0;
      const leftArchetype = inferArchetypeFromName(left.name);
      const rightArchetype = inferArchetypeFromName(right.name);
      const involvesMarket = leftArchetype === "mercado" || rightArchetype === "mercado";
      const sameArchetype = leftArchetype === rightArchetype;
      const maxAllowed = involvesMarket ? 0.68 : sameArchetype ? 0.62 : 0.55;

      if (overlap > maxAllowed) {
        failures.push(
          `[menu-overlap:${category}] ${left.name} vs ${right.name} has Jaccard ${overlap.toFixed(2)} (max ${maxAllowed.toFixed(2)})`
        );
      }
    }
  }
}

if (failures.length) {
  console.error("Demo catalog validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Demo catalog validation passed.");
console.log(`Providers checked: ${demoProviders.length}`);
console.log(`Products checked: ${demoProviders.reduce((total, provider) => total + provider.products.length, 0)}`);
