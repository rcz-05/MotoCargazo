import { createServiceClient } from "./client.ts";

type AllowedRole = "restaurant" | "producer" | "admin";

export async function assertMembership(
  userId: string,
  organizationId: string,
  allowedRoles: AllowedRole[]
): Promise<void> {
  const client = createServiceClient();
  const { data, error } = await client
    .from("memberships")
    .select("role")
    .eq("user_id", userId)
    .eq("organization_id", organizationId)
    .in("role", allowedRoles)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Forbidden: no membership for this organization and role");
  }
}

export async function assertAnyRole(userId: string, allowedRoles: AllowedRole[]): Promise<void> {
  const client = createServiceClient();
  const { data, error } = await client
    .from("memberships")
    .select("role")
    .eq("user_id", userId)
    .in("role", allowedRoles)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Forbidden: user role not allowed");
  }
}
