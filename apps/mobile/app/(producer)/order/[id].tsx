import { useMemo } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { fetchOrderById, updateOrderStatus } from "../../../lib/api";
import { formatDateTime } from "../../../lib/dates";
import { orderStatusLabel } from "../../../lib/showcase";
import { colors, elevation, fonts, radius } from "../../../lib/theme";

const statusOrder = ["submitted", "accepted_by_producer", "preparing", "out_for_delivery", "delivered"] as const;

function getNextStatus(current: string) {
  const index = statusOrder.indexOf(current as (typeof statusOrder)[number]);
  if (index === -1 || index === statusOrder.length - 1) return null;
  return statusOrder[index + 1];
}

export default function ProducerOrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const orderQuery = useQuery({
    queryKey: ["producer-order", id],
    queryFn: () => fetchOrderById(id)
  });

  const nextStatus = useMemo(() => {
    return orderQuery.data ? getNextStatus(orderQuery.data.status) : null;
  }, [orderQuery.data]);

  const mutation = useMutation({
    mutationFn: (status: string) => updateOrderStatus(id, status),
    onSuccess: () => orderQuery.refetch()
  });

  return (
    <AppScreen dark={false} backgroundColor={colors.bgLight}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={18} color={colors.textStrong} />
        </Pressable>
        <Text style={styles.title}>Detalle de pedido</Text>
      </View>

      {orderQuery.data ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{`Pedido #${orderQuery.data.id.slice(0, 8)}`}</Text>
          <Text style={styles.meta}>{`Estado actual: ${orderStatusLabel(orderQuery.data.status)}`}</Text>
          <Text style={styles.meta}>{`Entrega: ${formatDateTime(orderQuery.data.scheduled_delivery_start)} - ${formatDateTime(orderQuery.data.scheduled_delivery_end)}`}</Text>
          <Text style={styles.meta}>{`Total: ${Number(orderQuery.data.total_eur).toFixed(2)}€`}</Text>
        </View>
      ) : (
        <Text style={styles.meta}>Cargando pedido...</Text>
      )}

      {nextStatus ? (
        <PrimaryButton
          title={mutation.isPending ? "Actualizando..." : `Marcar como ${orderStatusLabel(nextStatus)}`}
          onPress={() => mutation.mutate(nextStatus)}
        />
      ) : (
        <Text style={styles.meta}>El pedido ya alcanzó su estado final.</Text>
      )}

      <PrimaryButton variant="secondary" title="Cancelar pedido" onPress={() => mutation.mutate("cancelled")} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: colors.textStrong,
    fontSize: 30,
    lineHeight: 35,
    fontFamily: fonts.heading
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 12,
    gap: 4,
    ...elevation.level1
  },
  cardTitle: {
    color: colors.textStrong,
    fontSize: 17,
    fontFamily: fonts.bodyStrong
  },
  meta: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  }
});
