import { useLocalSearchParams, router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { acceptContract, requestContractRevision } from "../../../lib/api";
import { supabase } from "../../../lib/supabase";
import { colors, radius } from "../../../lib/theme";

export default function ContractDetailScreen() {
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
    <AppScreen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Contrato</Text>
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
        title={revisionMutation.isPending ? "Solicitando..." : "Solicitar una revisión"}
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
        dark
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
  back: {
    color: colors.brand,
    fontSize: 26,
    fontWeight: "700"
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "800"
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgDarkSoft,
    padding: 10,
    gap: 6
  },
  status: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700"
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700"
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13
  },
  mono: {
    color: colors.textPrimary,
    fontSize: 12,
    fontFamily: "Courier"
  }
});
