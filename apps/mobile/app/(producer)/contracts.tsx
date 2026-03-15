import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../components/AppScreen";
import { EmptyState } from "../../components/EmptyState";
import { fetchProducerContracts } from "../../lib/api";
import { contractStatusLabel } from "../../lib/showcase";
import { useSession } from "../../lib/session";
import { colors, elevation, fonts, radius, spacing } from "../../lib/theme";

export default function ProducerContractsScreen() {
  const { roleSession } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["producer-contracts", roleSession.organizationId],
    enabled: Boolean(roleSession.organizationId),
    queryFn: () => fetchProducerContracts(roleSession.organizationId!)
  });

  return (
    <AppScreen scroll={false} dark={false} backgroundColor={colors.bgLight} style={{ paddingHorizontal: spacing.md }}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <MaterialCommunityIcons name="chevron-left" size={20} color={colors.textStrong} />
            </Pressable>
            <View>
              <Text style={styles.title}>Contratos proveedor</Text>
              <Text style={styles.subtitle}>Seguimiento de revisiones y versiones</Text>
            </View>
          </View>
        }
        ListEmptyComponent={isLoading ? <Text style={styles.meta}>Cargando...</Text> : <EmptyState light title="Sin contratos" />}
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
  subtitle: {
    color: colors.textSoftDark,
    fontSize: 12,
    fontFamily: fonts.body
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 10,
    gap: 4,
    ...elevation.level1
  },
  cardTitle: {
    color: colors.textStrong,
    fontSize: 16,
    fontFamily: fonts.bodyStrong
  },
  meta: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  }
});
