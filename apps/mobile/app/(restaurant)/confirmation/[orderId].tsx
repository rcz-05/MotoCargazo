import { useEffect, useMemo } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { AppImage } from "../../../components/AppImage";
import { fetchOrderById } from "../../../lib/api";
import { isDemoApp } from "../../../lib/app-mode";
import { formatDateTime, formatEuro } from "../../../lib/dates";
import { categoryCover, sevilleMap } from "../../../lib/demoMedia";
import { getDemoProviderById } from "../../../lib/demoCatalog";
import { orderStatusLabel } from "../../../lib/showcase";
import { colors, fonts, radius, spacing } from "../../../lib/theme";
import { useDemoOrderStore } from "../../../store/demo-order-store";

const statusOrder = ["submitted", "accepted_by_producer", "preparing", "out_for_delivery", "delivered"] as const;
const statusDelayMs: Record<(typeof statusOrder)[number], number> = {
  submitted: 2800,
  accepted_by_producer: 3200,
  preparing: 3600,
  out_for_delivery: 4200,
  delivered: 0
};

const statusDescription: Record<(typeof statusOrder)[number], string> = {
  submitted: "Pedido recibido y validado.",
  accepted_by_producer: "Proveedor confirmado para tu franja horaria.",
  preparing: "Preparando cajas, frío y etiquetado.",
  out_for_delivery: "Reparto en ruta hacia tu restaurante.",
  delivered: "Entrega completada y cerrada en sistema."
};

function buildFallbackTimeline(currentStatus: string) {
  const currentIndex = statusOrder.indexOf((statusOrder as readonly string[]).includes(currentStatus) ? (currentStatus as (typeof statusOrder)[number]) : "submitted");
  return statusOrder.map((step, index) => ({
    key: step,
    label: orderStatusLabel(step),
    reached: index <= currentIndex
  }));
}

export default function OrderConfirmationScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const normalizedOrderId = String(orderId ?? "");
  const isDemoOrder = normalizedOrderId.startsWith("demo-");

  const demoOrder = useDemoOrderStore((state) => (normalizedOrderId ? state.orders[normalizedOrderId] : undefined));
  const advanceOrderStatus = useDemoOrderStore((state) => state.advanceOrderStatus);

  const { data: remoteOrder, isLoading } = useQuery({
    queryKey: ["order", normalizedOrderId],
    enabled: Boolean(normalizedOrderId) && !isDemoOrder && !isDemoApp,
    queryFn: () => fetchOrderById(normalizedOrderId)
  });

  const data = isDemoOrder ? demoOrder : remoteOrder;
  const loading = isDemoOrder ? !demoOrder : isLoading;
  const producer = data?.producer_organization_id ? getDemoProviderById(data.producer_organization_id) : null;

  useEffect(() => {
    if (!isDemoOrder || !demoOrder || !normalizedOrderId) return;
    if (demoOrder.status === "delivered") return;

    const delay = statusDelayMs[demoOrder.status];
    const timer = setTimeout(() => {
      advanceOrderStatus(normalizedOrderId);
    }, delay);

    return () => clearTimeout(timer);
  }, [isDemoOrder, demoOrder?.status, normalizedOrderId, advanceOrderStatus, demoOrder]);

  const timeline = useMemo(() => {
    if (!data) return [];
    if ("timeline" in data && Array.isArray(data.timeline)) return data.timeline;
    return buildFallbackTimeline(data.status);
  }, [data]);

  const currentStepIndex = useMemo(() => {
    if (!data) return 0;
    return Math.max(0, statusOrder.indexOf((statusOrder as readonly string[]).includes(data.status) ? (data.status as (typeof statusOrder)[number]) : "submitted"));
  }, [data]);

  return (
    <AppScreen dark={false} backgroundColor={colors.bgLight} style={styles.root}>
      <View style={styles.mapWrap}>
        <AppImage
          source={sevilleMap}
          fallbackSource={[categoryCover.produce, categoryCover.meat]}
          style={styles.mapImage}
          borderRadius={0}
        />
        <View style={styles.mapOverlay} />

        <Pressable style={styles.closeButton} onPress={() => router.replace("/(restaurant)")}>
          <MaterialCommunityIcons name="close" size={20} color={colors.white} />
        </Pressable>

        <View style={styles.confirmationBadge}>
          <MaterialCommunityIcons
            name={data?.status === "delivered" ? "check-circle" : "bike"}
            size={28}
            color={data?.status === "delivered" ? colors.brandDark : "#0f8f6e"}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.confirmationTitle}>
              {data?.status === "delivered" ? "Pedido entregado" : "Pedido en marcha"}
            </Text>
            <Text style={styles.confirmationSub}>
              {data ? statusDescription[(statusOrder as readonly string[]).includes(data.status) ? (data.status as (typeof statusOrder)[number]) : "submitted"] : "Inicializando seguimiento..."}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.sheetTitle}>Seguimiento en vivo</Text>

        {loading ? <Text style={styles.meta}>Cargando estado...</Text> : null}

        {data ? (
          <>
            <View style={styles.timelineCard}>
              <Text style={styles.metaStrong}>{`Pedido #${data.id.slice(0, 8)}`}</Text>
              <Text style={styles.meta}>{producer ? `Proveedor: ${producer.name}` : "Proveedor asignado"}</Text>
              <Text style={styles.meta}>{`Entrega estimada: ${formatDateTime(data.scheduled_delivery_start)} - ${formatDateTime(data.scheduled_delivery_end)}`}</Text>
              <Text style={styles.meta}>{`Total: ${formatEuro(Number(data.total_eur ?? 0))}`}</Text>
            </View>

            <View style={styles.timelineSteps}>
              {timeline.map((step, index) => {
                const reached = step.reached;
                const active = index === currentStepIndex && data.status !== "delivered";

                return (
                  <View key={step.key} style={styles.timelineRow}>
                    <View style={[styles.timelineIcon, reached && styles.timelineIconReached, active && styles.timelineIconActive]}>
                      <MaterialCommunityIcons
                        name={reached ? "check" : "checkbox-blank-circle-outline"}
                        size={13}
                        color={reached ? colors.white : "#7a838d"}
                      />
                    </View>
                    <View style={styles.timelineTextWrap}>
                      <Text style={[styles.timelineLabel, reached && styles.timelineLabelReached]}>{step.label}</Text>
                      {active ? <Text style={styles.timelineHint}>Actualizando automáticamente...</Text> : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : null}

        <PrimaryButton
          title={data?.status === "delivered" ? "Hacer otro pedido" : "Volver al inicio"}
          onPress={() => router.replace("/(restaurant)")}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  mapWrap: {
    height: 300,
    position: "relative",
    marginBottom: 8
  },
  mapImage: {
    width: "100%",
    height: "100%"
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11,15,21,0.15)"
  },
  closeButton: {
    position: "absolute",
    top: 14,
    left: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.48)",
    alignItems: "center",
    justifyContent: "center"
  },
  confirmationBadge: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 12,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "#b8e8c5",
    backgroundColor: "rgba(250,255,251,0.94)",
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  confirmationTitle: {
    color: colors.textStrong,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.heading
  },
  confirmationSub: {
    color: colors.textSoftDark,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.bgLight,
    paddingHorizontal: spacing.md,
    gap: 10
  },
  sheetTitle: {
    color: colors.textStrong,
    fontSize: 34,
    lineHeight: 39,
    fontFamily: fonts.heading
  },
  timelineCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 12,
    gap: 4
  },
  timelineSteps: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 12,
    gap: 10
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8
  },
  timelineIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#cbd3dd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightSurfaceSoft
  },
  timelineIconReached: {
    borderColor: colors.brandDark,
    backgroundColor: colors.brandDark
  },
  timelineIconActive: {
    shadowColor: colors.brandDark,
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2
  },
  timelineTextWrap: {
    flex: 1,
    paddingTop: 1
  },
  timelineLabel: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  timelineLabelReached: {
    color: colors.textStrong
  },
  timelineHint: {
    marginTop: 2,
    color: colors.brandDark,
    fontSize: 12,
    fontFamily: fonts.body
  },
  metaStrong: {
    color: colors.textStrong,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  meta: {
    color: colors.textSoftDark,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body
  }
});
