import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../components/AppScreen";
import { EmptyState } from "../../components/EmptyState";
import { fetchProducerOrders } from "../../lib/api";
import { formatDateTime, formatEuro } from "../../lib/dates";
import { orderStatusLabel } from "../../lib/showcase";
import { useSession } from "../../lib/session";
import { colors, elevation, fonts, radius, spacing } from "../../lib/theme";

export default function ProducerOrdersScreen() {
  const { roleSession, signOut } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["producer-orders", roleSession.organizationId],
    enabled: Boolean(roleSession.organizationId),
    queryFn: () => fetchProducerOrders(roleSession.organizationId!)
  });

  return (
    <AppScreen scroll={false} dark={false} backgroundColor={colors.bgLight} style={{ paddingHorizontal: spacing.md }}>
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
                <MaterialCommunityIcons name="file-document-outline" size={14} color={colors.brandDark} />
                <Text style={styles.link}>Contratos</Text>
              </Pressable>
              <Pressable onPress={signOut} style={styles.linkButton}>
                <MaterialCommunityIcons name="logout" size={14} color={colors.brandDark} />
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={isLoading ? <Text style={styles.meta}>Cargando...</Text> : <EmptyState light title="No hay pedidos hoy" />}
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
    marginBottom: 8,
    gap: 8
  },
  title: {
    color: colors.textStrong,
    fontSize: 32,
    lineHeight: 37,
    fontFamily: fonts.heading
  },
  subtitle: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  linkButton: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    paddingHorizontal: 10,
    minHeight: 32,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    ...elevation.level1
  },
  link: {
    color: colors.brandDark,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.2,
    fontFamily: fonts.bodyStrong
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
  },
  total: {
    color: colors.brandDark,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  }
});
