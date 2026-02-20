import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "../../components/AppScreen";
import { EmptyState } from "../../components/EmptyState";
import { fetchProducerOrders } from "../../lib/api";
import { formatDateTime, formatEuro } from "../../lib/dates";
import { orderStatusLabel } from "../../lib/showcase";
import { useSession } from "../../lib/session";
import { colors, radius, spacing } from "../../lib/theme";

export default function ProducerOrdersScreen() {
  const { roleSession, signOut } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["producer-orders", roleSession.organizationId],
    enabled: Boolean(roleSession.organizationId),
    queryFn: () => fetchProducerOrders(roleSession.organizationId!)
  });

  return (
    <AppScreen scroll={false} style={{ paddingHorizontal: spacing.md }}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Pedidos de hoy</Text>
              <Text style={styles.subtitle}>{roleSession.organizationName ?? "Proveedor"}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => router.push("/(producer)/contracts")} style={styles.linkButton}>
                <Text style={styles.link}>Contratos</Text>
              </Pressable>
              <Pressable onPress={signOut} style={styles.linkButton}>
                <Ionicons name="log-out-outline" size={14} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={isLoading ? <Text style={styles.meta}>Cargando...</Text> : <EmptyState title="No hay pedidos hoy" />}
        contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/(producer)/order/${item.id}`)}>
            <Text style={styles.cardTitle}>{`Pedido #${item.id.slice(0, 8)}`}</Text>
            <Text style={styles.meta}>{`Estado: ${orderStatusLabel(item.status)}`}</Text>
            <Text style={styles.meta}>{`Entrega: ${formatDateTime(item.scheduled_delivery_start)}`}</Text>
            <Text style={styles.total}>{`Total: ${formatEuro(Number(item.total_eur))}`}</Text>
          </Pressable>
        )}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  linkButton: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: "rgba(17, 34, 61, 0.75)",
    paddingHorizontal: 10,
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center"
  },
  link: {
    color: colors.brandSoft,
    fontWeight: "700",
    fontSize: 12
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.bgCard,
    padding: 12,
    gap: 4
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700"
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13
  },
  total: {
    color: colors.brandSoft,
    fontSize: 13,
    fontWeight: "700"
  }
});
