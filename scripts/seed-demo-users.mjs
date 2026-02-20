import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const raw = fs.readFileSync(filePath, "utf8");
  const values = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    values[key] = value;
  }
  return values;
}

const env = {
  ...loadDotEnv(path.join(rootDir, ".env")),
  ...process.env
};

const supabaseUrl = env.SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in /Users/rayancastillazouine/MotoCargazo/.env");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const demoUsers = [
  {
    email: "restaurante-demo@motocargo.es",
    password: "MotoCargoDemo!2026",
    fullName: "Restaurante Demo Sevilla",
    requestedRole: "restaurant"
  },
  {
    email: "proveedor-demo@motocargo.es",
    password: "MotoCargoDemo!2026",
    fullName: "Proveedor Demo Sevilla",
    requestedRole: "producer"
  }
];

async function createDemoUser(userConfig) {
  const { data, error } = await admin.auth.admin.createUser({
    email: userConfig.email,
    password: userConfig.password,
    email_confirm: true,
    user_metadata: {
      full_name: userConfig.fullName,
      requested_role: userConfig.requestedRole
    }
  });

  if (error) {
    const lowered = error.message.toLowerCase();
    if (lowered.includes("already") || lowered.includes("registered")) {
      return { id: "existing-user", created: false };
    }
    throw error;
  }
  if (!data.user) throw new Error(`No se pudo crear el usuario ${userConfig.email}`);
  return { id: data.user.id, created: true };
}

async function run() {
  console.log("Creating/updating demo users...");

  for (const user of demoUsers) {
    const result = await createDemoUser(user);
    console.log(`${result.created ? "CREATED" : "UPDATED"} ${user.email} (${user.requestedRole}) -> ${result.id}`);
  }

  console.log("\nDemo credentials:");
  console.log("  restaurante-demo@motocargo.es / MotoCargoDemo!2026");
  console.log("  proveedor-demo@motocargo.es / MotoCargoDemo!2026");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
