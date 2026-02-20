import { createClient } from "@supabase/supabase-js";

function getEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function createServiceClient() {
  return createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function getAuthedUser(request: Request) {
  const authorization = request.headers.get("Authorization") ?? "";
  const token = authorization.replace("Bearer ", "").trim();

  if (!token) {
    throw new Error("Unauthorized: missing bearer token");
  }

  const client = createServiceClient();
  const { data, error } = await client.auth.getUser(token);

  if (error || !data.user) {
    throw new Error("Unauthorized: invalid token");
  }

  return data.user;
}
