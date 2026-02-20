import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { EmptyState } from "../../../components/EmptyState";
import { contractStatusLabel } from "../../../lib/showcase";
import { supabase } from "../../../lib/supabase";
import { useSession } from "../../../lib/session";
import { colors, radius, spacing } from "../../../lib/theme";

export default function ContractsListScreen() {
  const { roleSession } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["contracts", roleSession.organizationId],
    enabled: Boolean(roleSession.organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("id, status, current_version, producer_organization_id, updated_at")
        .eq("restaurant_organization_id", roleSession.organizationId)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    }
  });

  return (
    <AppScreen scroll={false} style={{ paddingHorizontal: spacing.md }}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Contratos</Text>
              <Text style={styles.subtitle}>Gestión de términos y precios pactados</Text>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => router.push("/(restaurant)/recurring/new")} style={styles.actionButton}>
                <Ionicons name="repeat" size={14} color={colors.brandSoft} />
                <Text style={styles.actionText}>Plan</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/(restaurant)/contracts/new")} style={styles.actionButton}>
                <Ionicons name="add" size={14} color={colors.brandSoft} />
                <Text style={styles.actionText}>Nuevo</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={isLoading ? <Text style={styles.meta}>Cargando...</Text> : <EmptyState title="Sin contratos aún" />}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/(restaurant)/contracts/${item.id}`)}>
            <Text style={styles.cardTitle}>{`Contrato #${item.id.slice(0, 8)}`}</Text>
            <Text style={styles.meta}>{`Estado: ${contractStatusLabel(item.status)} · V${item.current_version}`}</Text>
          </Pressable>
        )}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  actionButton: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: "rgba(17, 34, 61, 0.75)",
    minHeight: 32,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  actionText: {
    color: colors.brandSoft,
    fontSize: 12,
    fontWeight: "700"
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
  }
});
