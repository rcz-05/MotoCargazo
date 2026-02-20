import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "../../components/AppScreen";
import { EmptyState } from "../../components/EmptyState";
import { PrimaryButton } from "../../components/PrimaryButton";
import { StatusPill } from "../../components/StatusPill";
import {
  checkoutOrder,
  fetchActiveContract,
  fetchDeliveryWindows,
  fetchVehicleProfiles,
  validateCompliance
} from "../../lib/api";
import { computeNextWindow, formatDateTime } from "../../lib/dates";
import { useSession } from "../../lib/session";
import { colors, fonts, radius, spacing } from "../../lib/theme";
import { useCartStore } from "../../store/cart-store";

const paymentOptions = [
  { id: "card", title: "Tarjeta terminada en 7520", subtitle: "Visa corporativa" },
  { id: "invoice", title: "Factura de empresa", subtitle: "Pago a 30 días" },
  { id: "bizum", title: "Bizum Business", subtitle: "Pago instantáneo (demo)" }
] as const;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function CheckoutScreen() {
  const { roleSession } = useSession();
  const cartItems = useCartStore((state) => state.items);
  const producerId = useCartStore((state) => state.producerId);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.getSubtotal());

  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<(typeof paymentOptions)[number]["id"]>("card");
  const [compliance, setCompliance] = useState<{ isCompliant: boolean; reasons: string[] } | null>(null);
  const [gatewayProcessing, setGatewayProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const restaurantId = roleSession.organizationId ?? "demo-restaurant";

  const contractQuery = useQuery({
    queryKey: ["active-contract", restaurantId, producerId],
    enabled: Boolean(producerId),
    queryFn: () => fetchActiveContract(restaurantId, producerId!)
  });

  const deliveryWindowsQuery = useQuery({
    queryKey: ["delivery-windows", producerId],
    enabled: Boolean(producerId),
    queryFn: () => fetchDeliveryWindows(producerId!)
  });

  const vehicleProfilesQuery = useQuery({
    queryKey: ["vehicle-profiles", restaurantId],
    enabled: Boolean(restaurantId),
    queryFn: () => fetchVehicleProfiles(restaurantId)
  });

  useEffect(() => {
    if (!selectedWindowId && deliveryWindowsQuery.data?.length) {
      setSelectedWindowId(deliveryWindowsQuery.data[0].id);
    }
  }, [selectedWindowId, deliveryWindowsQuery.data]);

  useEffect(() => {
    if (!selectedVehicleId && vehicleProfilesQuery.data?.length) {
      setSelectedVehicleId(vehicleProfilesQuery.data[0].id);
    }
  }, [selectedVehicleId, vehicleProfilesQuery.data]);

  useEffect(() => {
    const runCompliance = async () => {
      if (!producerId || !selectedWindowId || !selectedVehicleId) return;

      try {
        const result = await validateCompliance({
          producerId,
          restaurantId,
          deliveryWindowId: selectedWindowId,
          vehicleProfileId: selectedVehicleId
        });

        setCompliance({
          isCompliant: result.isCompliant,
          reasons: result.reasons
        });
      } catch {
        setCompliance({
          isCompliant: true,
          reasons: []
        });
      }
    };

    runCompliance();
  }, [producerId, restaurantId, selectedWindowId, selectedVehicleId]);

  const checkoutMutation = useMutation({
    mutationFn: checkoutOrder,
    onSuccess: (result) => {
      clearCart();
      router.replace(`/(restaurant)/confirmation/${result.orderId}`);
    },
    onError: (error) => {
      setGatewayProcessing(false);
      setErrorMessage((error as Error).message);
    }
  });

  const selectedWindow = deliveryWindowsQuery.data?.find((window) => window.id === selectedWindowId);
  const selectedVehicle = vehicleProfilesQuery.data?.find((vehicle) => vehicle.id === selectedVehicleId);

  const schedule = useMemo(() => {
    if (!selectedWindow) {
      const now = new Date();
      return {
        start: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        end: new Date(now.getTime() + 3 * 60 * 60 * 1000)
      };
    }
    return computeNextWindow(selectedWindow.day_of_week, selectedWindow.start_time, selectedWindow.end_time);
  }, [selectedWindow]);

  const deliveryFee = subtotal >= 120 ? 0 : 3.99;
  const serviceFee = 0.3;
  const total = subtotal + deliveryFee + serviceFee;

  const demoMode = !contractQuery.data || String(contractQuery.data.id).startsWith("demo-contract-");

  if (!cartItems.length || !producerId) {
    return (
      <AppScreen dark={false} backgroundColor={colors.bgLight}>
        <EmptyState light title="No hay productos para checkout" subtitle="Añade productos al carrito antes de continuar." />
      </AppScreen>
    );
  }

  return (
    <AppScreen dark={false} backgroundColor={colors.bgLight} style={styles.root}>
      <View style={styles.navRow}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={20} color={colors.textStrong} />
        </Pressable>
        <Text style={styles.title}>Finalizar pedido</Text>
        <View style={styles.iconButtonPlaceholder} />
      </View>

      {demoMode ? (
        <View style={styles.demoBanner}>
          <Ionicons name="sparkles-outline" size={16} color="#37531c" />
          <Text style={styles.demoBannerText}>Modo demo activo: flujo completo de pedido y pago simulado.</Text>
        </View>
      ) : null}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Franja de entrega</Text>
        {deliveryWindowsQuery.data?.map((window) => {
          const isSelected = window.id === selectedWindowId;
          const scheduled = computeNextWindow(window.day_of_week, window.start_time, window.end_time);

          return (
            <Pressable key={window.id} onPress={() => setSelectedWindowId(window.id)} style={[styles.option, isSelected && styles.optionActive]}>
              <Text style={styles.optionTitle}>{`${window.start_time} - ${window.end_time}`}</Text>
              <Text style={styles.optionSubtitle}>{`Próxima: ${formatDateTime(scheduled.start.toISOString())}`}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Vehículo para reparto</Text>
        {vehicleProfilesQuery.data?.map((vehicle) => {
          const isSelected = vehicle.id === selectedVehicleId;
          return (
            <Pressable key={vehicle.id} onPress={() => setSelectedVehicleId(vehicle.id)} style={[styles.option, isSelected && styles.optionActive]}>
              <Text style={styles.optionTitle}>{vehicle.label}</Text>
              <Text style={styles.optionSubtitle}>{`${vehicle.weight_kg}kg · ${vehicle.height_cm}cm · ${vehicle.is_electric ? "Eléctrico" : "No eléctrico"}`}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.complianceWrap}>
        {compliance?.isCompliant !== false ? (
          <StatusPill light label="Cumple normativa" type="success" />
        ) : (
          <StatusPill light label="Revisión de cumplimiento (demo)" type="warning" />
        )}
      </View>

      {!compliance?.isCompliant && compliance?.reasons?.length ? (
        <View style={styles.warningBox}>
          {compliance.reasons.map((reason) => (
            <Text key={reason} style={styles.warningText}>{`• ${reason}`}</Text>
          ))}
          <Text style={styles.warningHint}>Continuaremos en modo demostración para mostrar el flujo completo.</Text>
        </View>
      ) : null}

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Pasarela de pago</Text>
        {paymentOptions.map((payment) => {
          const selected = payment.id === selectedPayment;
          return (
            <Pressable key={payment.id} style={[styles.paymentOption, selected && styles.paymentOptionActive]} onPress={() => setSelectedPayment(payment.id)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>{payment.title}</Text>
                <Text style={styles.optionSubtitle}>{payment.subtitle}</Text>
              </View>
              {selected ? <Ionicons name="radio-button-on" size={18} color={colors.brandDark} /> : <Ionicons name="radio-button-off" size={18} color="#8b96a2" />}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Productos</Text>
          <Text style={styles.summaryValue}>{`${subtotal.toFixed(2)}€`}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Envío</Text>
          <Text style={styles.summaryValue}>{`${deliveryFee.toFixed(2)}€`}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Gastos de gestión</Text>
          <Text style={styles.summaryValue}>{`${serviceFee.toFixed(2)}€`}</Text>
        </View>
        <View style={styles.summaryRowTotal}>
          <Text style={styles.summaryTotalLabel}>TOTAL</Text>
          <Text style={styles.summaryTotalValue}>{`${total.toFixed(2)}€`}</Text>
        </View>
      </View>

      {gatewayProcessing ? <Text style={styles.gatewayText}>Procesando pago en pasarela segura...</Text> : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <PrimaryButton
        title={checkoutMutation.isPending || gatewayProcessing ? "Procesando..." : "Pagar y confirmar"}
        disabled={checkoutMutation.isPending || gatewayProcessing || !selectedWindow || !selectedVehicle}
        onPress={async () => {
          if (!selectedWindow || !selectedVehicle || !schedule) return;

          setErrorMessage(null);
          setGatewayProcessing(true);
          await wait(1250);

          checkoutMutation.mutate({
            contractId: contractQuery.data?.id ?? `demo-contract-${producerId}`,
            deliveryWindowId: selectedWindow.id,
            vehicleProfileId: selectedVehicle.id,
            scheduledDeliveryStart: schedule.start.toISOString(),
            scheduledDeliveryEnd: schedule.end.toISOString(),
            items: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unit: item.unit
            }))
          });
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.md
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 2
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    alignItems: "center",
    justifyContent: "center"
  },
  iconButtonPlaceholder: {
    width: 36,
    height: 36
  },
  title: {
    color: colors.textStrong,
    fontSize: 29,
    lineHeight: 34,
    fontFamily: fonts.heading
  },
  demoBanner: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#d6e9b0",
    backgroundColor: "#f3fbd9",
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  demoBannerText: {
    flex: 1,
    color: "#466325",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.bodyStrong
  },
  sectionCard: {
    backgroundColor: colors.lightSurface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    padding: 12,
    gap: 8
  },
  sectionTitle: {
    color: colors.textStrong,
    fontSize: 24,
    lineHeight: 29,
    fontFamily: fonts.heading
  },
  option: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurfaceSoft,
    padding: 10,
    gap: 2
  },
  optionActive: {
    borderColor: "#9cdcb0",
    backgroundColor: "#e8f8ed"
  },
  optionTitle: {
    color: colors.textStrong,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  optionSubtitle: {
    color: colors.textSoftDark,
    fontSize: 12,
    fontFamily: fonts.body
  },
  complianceWrap: {
    marginTop: -2
  },
  warningBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#f2ce5f",
    backgroundColor: "#fff7dc",
    padding: 10,
    gap: 4
  },
  warningText: {
    color: "#6e5826",
    fontSize: 12,
    lineHeight: 17,
    fontFamily: fonts.body
  },
  warningHint: {
    color: "#5a4109",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.bodyStrong
  },
  paymentOption: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurfaceSoft,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  paymentOptionActive: {
    borderColor: "#9cdcb0",
    backgroundColor: "#e8f8ed"
  },
  summaryCard: {
    backgroundColor: colors.lightSurface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    padding: 12,
    gap: 8
  },
  summaryTitle: {
    color: colors.textStrong,
    fontSize: 25,
    lineHeight: 30,
    fontFamily: fonts.heading
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  summaryLabel: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.body
  },
  summaryValue: {
    color: colors.textStrong,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  summaryRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2
  },
  summaryTotalLabel: {
    color: colors.textStrong,
    fontSize: 19,
    lineHeight: 24,
    fontFamily: fonts.heading
  },
  summaryTotalValue: {
    color: colors.textStrong,
    fontSize: 22,
    lineHeight: 26,
    fontFamily: fonts.heading
  },
  gatewayText: {
    color: colors.brandDark,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  },
  error: {
    color: "#d33f3f",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body
  }
});
