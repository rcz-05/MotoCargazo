import { Redirect, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { TextInputField } from "../../../components/TextInputField";
import { createRecurringPlan } from "../../../lib/api";
import { isDemoApp } from "../../../lib/app-mode";
import { useSession } from "../../../lib/session";
import { supabase } from "../../../lib/supabase";
import { colors, elevation, fonts, radius } from "../../../lib/theme";

const schema = z.object({
  contractId: z.string().uuid(),
  name: z.string().min(3),
  cronExpression: z.string().min(3),
  productId: z.string().uuid(),
  quantity: z.coerce.number().positive(),
  autoConfirm: z.boolean()
});

type FormValues = z.infer<typeof schema>;

export default function NewRecurringPlanScreen() {
  if (isDemoApp) {
    return <Redirect href="/(restaurant)" />;
  }

  const { roleSession } = useSession();

  const { data: contracts } = useQuery({
    queryKey: ["active-contracts", roleSession.organizationId],
    enabled: Boolean(roleSession.organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contracts")
        .select("id, producer_organization_id, status")
        .eq("restaurant_organization_id", roleSession.organizationId)
        .eq("status", "active");

      if (error) throw error;
      return data ?? [];
    }
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      contractId: "",
      name: "Pedido semanal",
      cronExpression: "0 6 * * 1",
      productId: "",
      quantity: 1,
      autoConfirm: false
    }
  });

  const mutation = useMutation({
    mutationFn: createRecurringPlan,
    onSuccess: () => router.back()
  });

  const selectedContract = contracts?.find((contract) => contract.id === watch("contractId"));

  return (
    <AppScreen dark={false} backgroundColor={colors.bgLight}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={18} color={colors.textStrong} />
        </Pressable>
        <Text style={styles.title}>Plan recurrente</Text>
      </View>

      <Text style={styles.subtitle}>Automatiza pedidos diarios o semanales bajo contrato activo.</Text>

      <View style={styles.contractList}>
        {(contracts ?? []).map((contract) => (
          <Pressable
            key={contract.id}
            onPress={() => setValue("contractId", contract.id)}
            style={[styles.contractOption, watch("contractId") === contract.id && styles.contractOptionActive]}
          >
            <Text style={styles.contractTitle}>{`Contrato #${contract.id.slice(0, 8)}`}</Text>
            <Text style={styles.contractMeta}>{`Estado: ${contract.status}`}</Text>
          </Pressable>
        ))}
        {errors.contractId ? <Text style={styles.error}>{errors.contractId.message}</Text> : null}
      </View>

      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange } }) => (
          <TextInputField light label="Nombre del plan" value={value} onChangeText={onChange} error={errors.name?.message} />
        )}
      />

      <Controller
        control={control}
        name="cronExpression"
        render={({ field: { value, onChange } }) => (
          <TextInputField
            light
            label="Cron"
            value={value}
            onChangeText={onChange}
            placeholder="0 6 * * 1"
            error={errors.cronExpression?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="productId"
        render={({ field: { value, onChange } }) => (
          <TextInputField light label="Product ID" value={value} onChangeText={onChange} error={errors.productId?.message} />
        )}
      />

      <Controller
        control={control}
        name="quantity"
        render={({ field: { value, onChange } }) => (
          <TextInputField
            light
            label="Cantidad"
            value={String(value)}
            onChangeText={onChange}
            keyboardType="numeric"
            error={errors.quantity?.message}
          />
        )}
      />

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Auto confirmar pedidos</Text>
        <Pressable
          onPress={() => setValue("autoConfirm", !watch("autoConfirm"))}
          style={[styles.toggle, watch("autoConfirm") && styles.toggleActive]}
        >
          <Text style={styles.toggleText}>{watch("autoConfirm") ? "Sí" : "No"}</Text>
        </Pressable>
      </View>

      <PrimaryButton
        title={isSubmitting || mutation.isPending ? "Guardando..." : "Guardar plan"}
        onPress={handleSubmit((values) => {
          if (!roleSession.organizationId || !selectedContract) return;

          mutation.mutate({
            contract_id: values.contractId,
            producer_organization_id: selectedContract.producer_organization_id,
            restaurant_organization_id: roleSession.organizationId,
            name: values.name,
            cron_expression: values.cronExpression,
            line_items: [
              {
                product_id: values.productId,
                quantity: values.quantity,
                unit: "piece"
              }
            ],
            auto_confirm: values.autoConfirm,
            active: true
          });
        })}
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
  subtitle: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  },
  contractList: {
    gap: 8
  },
  contractOption: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 10,
    ...elevation.level1
  },
  contractOptionActive: {
    borderColor: colors.brandDark,
    backgroundColor: colors.brandSoft
  },
  contractTitle: {
    color: colors.textStrong,
    fontFamily: fonts.bodyStrong
  },
  contractMeta: {
    color: colors.textSoftDark,
    fontSize: 12,
    fontFamily: fonts.body
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toggleLabel: {
    color: colors.textStrong,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  toggle: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    minWidth: 56,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightSurface
  },
  toggleActive: {
    borderColor: colors.brandDark,
    backgroundColor: colors.brandSoft
  },
  toggleText: {
    color: colors.textStrong,
    fontFamily: fonts.bodyStrong
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    fontFamily: fonts.body
  }
});
