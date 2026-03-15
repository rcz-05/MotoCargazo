import { Redirect, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { EmptyState } from "../../../components/EmptyState";
import { contractStatusLabel } from "../../../lib/showcase";
import { supabase } from "../../../lib/supabase";
import { useSession } from "../../../lib/session";
import { isDemoApp } from "../../../lib/app-mode";
import { colors, elevation, fonts, radius, spacing } from "../../../lib/theme";

export default function ContractsListScreen() {
  if (isDemoApp) {
    return <Redirect href="/(restaurant)" />;
  }

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
    <AppScreen scroll={false} dark={false} backgroundColor={colors.bgLight} style={{ paddingHorizontal: spacing.md }}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Contratos</Text>
              <Text style={styles.subtitle}>Términos comerciales y revisiones activas</Text>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => router.push("/(restaurant)/recurring/new")} style={styles.actionButton}>
                <MaterialCommunityIcons name="repeat" size={14} color={colors.brandDark} />
                <Text style={styles.actionText}>Plan</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/(restaurant)/contracts/new")} style={styles.actionButton}>
                <MaterialCommunityIcons name="plus" size={15} color={colors.brandDark} />
                <Text style={styles.actionText}>Nuevo</Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={isLoading ? <Text style={styles.meta}>Cargando...</Text> : <EmptyState light title="Sin contratos aún" />}
        contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/(restaurant)/contracts/${item.id}`)}>
            <Text style={styles.cardTitle}>{`Contrato #${item.id.slice(0, 8)}`}</Text>
            <Text style={styles.meta}>{`Estado: ${contractStatusLabel(item.status)}`}</Text>
            <Text style={styles.meta}>{`Versión: ${item.current_version}`}</Text>
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
    alignItems: "center",
    gap: 8
  },
  actionButton: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    minHeight: 34,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    ...elevation.level1
  },
  actionText: {
    color: colors.brandDark,
    fontSize: 12,
    letterSpacing: 0.2,
    textTransform: "uppercase",
    fontFamily: fonts.bodyStrong
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 13,
    gap: 4,
    ...elevation.level1
  },
  cardTitle: {
    color: colors.textStrong,
    fontSize: 18,
    fontFamily: fonts.bodyStrong
  },
  meta: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  }
});
