import { describe, expect, it } from "vitest";
import {
  contractLifecycleSchema,
  orderLifecycleSchema,
  roleSessionSchema,
  recurringPlanInputSchema
} from "./index";

describe("domain schemas", () => {
  it("allows valid contract and order statuses", () => {
    expect(contractLifecycleSchema.parse("active")).toBe("active");
    expect(orderLifecycleSchema.parse("submitted")).toBe("submitted");
  });

  it("validates role session shape", () => {
    const parsed = roleSessionSchema.parse({
      userId: "5f847648-bca6-4d5b-8f0d-5b66fcac10ad",
      email: "buyer@restaurante.es",
      role: "restaurant",
      organizationId: "11111111-1111-1111-1111-111111111111",
      organizationName: "Tu Restaurante",
      city: "Sevilla",
      locale: "es-ES"
    });

    expect(parsed.organizationName).toBe("Tu Restaurante");
  });

  it("requires recurring plan line items", () => {
    const result = recurringPlanInputSchema.safeParse({
      contractId: "f3d4f2d1-0f77-4ed4-bca3-4f8eb6a3c3be",
      producerId: "ca43e48f-44f9-46f7-afef-8d590f3dc289",
      restaurantId: "b07387f9-d88f-4f4b-b410-d9703036e2ac",
      name: "Semanal Carnes",
      cronExpression: "0 6 * * 1",
      autoConfirm: false,
      lineItems: []
    });

    expect(result.success).toBe(false);
  });
});
