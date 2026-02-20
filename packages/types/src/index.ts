import { z } from "zod";

export const userRoleSchema = z.enum(["restaurant", "producer", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const contractLifecycleSchema = z.enum([
  "draft",
  "revision_requested",
  "accepted",
  "active",
  "suspended",
  "expired"
]);
export type ContractLifecycle = z.infer<typeof contractLifecycleSchema>;

export const orderLifecycleSchema = z.enum([
  "proposed",
  "submitted",
  "accepted_by_producer",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled"
]);
export type OrderLifecycle = z.infer<typeof orderLifecycleSchema>;

export const deliveryConstraintSchema = z.object({
  city: z.string(),
  zoneCode: z.string(),
  lowEmissionOnly: z.boolean(),
  maxVehicleWeightKg: z.number().positive(),
  maxVehicleHeightCm: z.number().positive(),
  slotStart: z.string().datetime(),
  slotEnd: z.string().datetime()
});
export type DeliveryConstraint = z.infer<typeof deliveryConstraintSchema>;

export const contractTermsSchema = z.object({
  minimumOrderValueEur: z.number().min(0),
  minimumOrderWeightKg: z.number().min(0),
  leadTimeHours: z.number().int().nonnegative(),
  defaultDeliveryFeeEur: z.number().min(0),
  cutOffTimeLocal: z.string(),
  deliveryWindowIds: z.array(z.string().uuid()).min(1),
  serviceZoneIds: z.array(z.string().uuid()).min(1),
  productPriceOverrides: z.array(
    z.object({
      productId: z.string().uuid(),
      negotiatedUnitPriceEur: z.number().positive(),
      minimumQuantity: z.number().positive()
    })
  ),
  cancellationWindowMinutes: z.number().int().min(0)
});
export type ContractTerms = z.infer<typeof contractTermsSchema>;

export const complianceResultSchema = z.object({
  isCompliant: z.boolean(),
  reasons: z.array(z.string()),
  fallbackSlots: z.array(
    z.object({
      slotId: z.string().uuid(),
      startAt: z.string().datetime(),
      endAt: z.string().datetime(),
      reason: z.string()
    })
  ),
  alternateProducerIds: z.array(z.string().uuid())
});
export type ComplianceResult = z.infer<typeof complianceResultSchema>;

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().positive(),
  unit: z.enum(["kg", "piece"]),
  unitPriceEur: z.number().positive(),
  lineTotalEur: z.number().positive()
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderSummarySchema = z.object({
  orderId: z.string().uuid(),
  producerId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  status: orderLifecycleSchema,
  scheduledDeliveryStart: z.string().datetime(),
  scheduledDeliveryEnd: z.string().datetime(),
  subtotalEur: z.number().min(0),
  deliveryFeeEur: z.number().min(0),
  totalEur: z.number().min(0),
  items: z.array(orderItemSchema)
});
export type OrderSummary = z.infer<typeof orderSummarySchema>;

export const recurringPlanInputSchema = z.object({
  contractId: z.string().uuid(),
  producerId: z.string().uuid(),
  restaurantId: z.string().uuid(),
  name: z.string().min(1),
  cronExpression: z.string().min(1),
  autoConfirm: z.boolean().default(false),
  nextRunAt: z.string().datetime().optional(),
  lineItems: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().positive(),
      unit: z.enum(["kg", "piece"])
    })
  ).min(1)
});
export type RecurringPlanInput = z.infer<typeof recurringPlanInputSchema>;

export const roleSessionSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  role: userRoleSchema,
  organizationId: z.string().uuid(),
  organizationName: z.string(),
  city: z.string(),
  locale: z.string().default("es-ES")
});
export type RoleSession = z.infer<typeof roleSessionSchema>;

export const contractRevisionRequestSchema = z.object({
  contractId: z.string().uuid(),
  message: z.string().min(5),
  requestedByUserId: z.string().uuid(),
  changes: z.array(
    z.object({
      field: z.string(),
      currentValue: z.string(),
      requestedValue: z.string()
    })
  )
});
export type ContractRevisionRequest = z.infer<typeof contractRevisionRequestSchema>;

export const contractAcceptanceSchema = z.object({
  contractId: z.string().uuid(),
  version: z.number().int().positive(),
  acceptedByUserId: z.string().uuid(),
  acceptedAt: z.string().datetime(),
  acceptanceMethod: z.enum(["in_app_checkbox", "otp_email"]),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional()
});
export type ContractAcceptance = z.infer<typeof contractAcceptanceSchema>;

export const invitationSchema = z.object({
  invitationId: z.string().uuid(),
  email: z.string().email(),
  role: userRoleSchema,
  organizationId: z.string().uuid(),
  city: z.string(),
  expiresAt: z.string().datetime(),
  acceptedAt: z.string().datetime().nullable()
});
export type Invitation = z.infer<typeof invitationSchema>;
