import { Redirect, useLocalSearchParams, router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { acceptContract, requestContractRevision } from "../../../lib/api";
import { isDemoApp } from "../../../lib/app-mode";
import { supabase } from "../../../lib/supabase";
import { colors, elevation, fonts, radius } from "../../../lib/theme";

export default function ContractDetailScreen() {
  if (isDemoApp) {
    return <Redirect href="/(restaurant)" />;
  }

  const { id } = useLocalSearchParams<{ id: string }>();

  const contractQuery = useQuery({
    queryKey: ["contract", id],
    queryFn: async () => {
      const [{ data: contract, error: contractError }, { data: versions, error: versionsError }] = await Promise.all([
        supabase
          .from("contracts")
          .select("id, status, current_version, producer_organization_id, restaurant_organization_id, active_from, active_until")
          .eq("id", id)
          .single(),
        supabase
          .from("contract_versions")
          .select("id, version_number, terms_json, change_note, created_at")
          .eq("contract_id", id)
          .order("version_number", { ascending: false })
      ]);

      if (contractError) throw contractError;
      if (versionsError) throw versionsError;

      return {
        contract,
        versions: versions ?? []
      };
    }
  });

  const revisionMutation = useMutation({
    mutationFn: requestContractRevision,
    onSuccess: () => contractQuery.refetch()
  });

  const acceptMutation = useMutation({
    mutationFn: acceptContract,
    onSuccess: () => contractQuery.refetch()
  });

  const contract = contractQuery.data?.contract;
  const latestVersion = contractQuery.data?.versions[0];

  return (
    <AppScreen dark={false} backgroundColor={colors.bgLight}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={18} color={colors.textStrong} />
        </Pressable>
        <Text style={styles.title}>Detalle de contrato</Text>
      </View>

      {contract ? (
        <View style={styles.card}>
          <Text style={styles.status}>{`Estado: ${contract.status}`}</Text>
          <Text style={styles.meta}>{`Versión actual: ${contract.current_version}`}</Text>
          <Text style={styles.meta}>{`Vigencia: ${contract.active_from ?? "-"} / ${contract.active_until ?? "-"}`}</Text>
        </View>
      ) : (
        <Text style={styles.meta}>Cargando contrato...</Text>
      )}

      {latestVersion ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Términos (última versión)</Text>
          <Text style={styles.meta}>{latestVersion.change_note ?? "Sin nota"}</Text>
          <Text style={styles.mono}>{JSON.stringify(latestVersion.terms_json, null, 2)}</Text>
        </View>
      ) : null}

      <PrimaryButton
        title={revisionMutation.isPending ? "Solicitando..." : "Solicitar revisión"}
        onPress={() => {
          if (!id) return;
          revisionMutation.mutate({
            contractId: id,
            message: "Solicitamos mejorar la ventana de entrega y MOQ.",
            changes: [
              {
                field: "minimumOrderValueEur",
                currentValue: "150",
                requestedValue: "120"
              }
            ]
          });
        }}
      />

      <PrimaryButton
        variant="secondary"
        title={acceptMutation.isPending ? "Aceptando..." : "Aceptar contrato"}
        onPress={() => {
          if (!id || !contract) return;
          acceptMutation.mutate({
            contractId: id,
            version: contract.current_version,
            acceptanceMethod: "in_app_checkbox"
          });
        }}
      />
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
    gap: 6,
    ...elevation.level1
  },
  status: {
    color: colors.textStrong,
    fontSize: 16,
    fontFamily: fonts.bodyStrong
  },
  sectionTitle: {
    color: colors.textStrong,
    fontSize: 16,
    fontFamily: fonts.bodyStrong
  },
  meta: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  },
  mono: {
    color: colors.textStrong,
    fontSize: 12,
    fontFamily: "Courier"
  }
});
