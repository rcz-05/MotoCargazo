import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "../../components/AppScreen";
import { EmptyState } from "../../components/EmptyState";
import { fetchProducerContracts } from "../../lib/api";
import { contractStatusLabel } from "../../lib/showcase";
import { useSession } from "../../lib/session";
import { colors, radius, spacing } from "../../lib/theme";

export default function ProducerContractsScreen() {
  const { roleSession } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["producer-contracts", roleSession.organizationId],
    enabled: Boolean(roleSession.organizationId),
    queryFn: () => fetchProducerContracts(roleSession.organizationId!)
  });

  return (
    <AppScreen scroll={false} style={{ paddingHorizontal: spacing.md }}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
            </Pressable>
            <View>
              <Text style={styles.title}>Contratos proveedor</Text>
              <Text style={styles.subtitle}>Seguimiento de revisiones y versiones</Text>
            </View>
          </View>
        }
        ListEmptyComponent={isLoading ? <Text style={styles.meta}>Cargando...</Text> : <EmptyState title="Sin contratos" />}
        contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{`Contrato #${item.id.slice(0, 8)}`}</Text>
            <Text style={styles.meta}>{`Estado: ${contractStatusLabel(item.status)}`}</Text>
            <Text style={styles.meta}>{`Versión: ${item.current_version}`}</Text>
          </View>
        )}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: "rgba(17, 34, 61, 0.75)",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.bgCard,
    padding: 10,
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
  }
});
