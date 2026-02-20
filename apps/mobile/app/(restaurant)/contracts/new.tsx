import { router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { TextInputField } from "../../../components/TextInputField";
import { createContractDraft, fetchProducersByCategory } from "../../../lib/api";
import { useSession } from "../../../lib/session";
import { colors, radius } from "../../../lib/theme";

const schema = z.object({
  producerOrganizationId: z.string().uuid("Selecciona un proveedor"),
  minimumOrderValueEur: z.coerce.number().min(0),
  leadTimeHours: z.coerce.number().int().min(1),
  cutOffTimeLocal: z.string().min(4)
});

type FormValues = z.infer<typeof schema>;

export default function NewContractScreen() {
  const { roleSession } = useSession();
  const { data: producers } = useQuery({
    queryKey: ["contract-producers"],
    queryFn: () => fetchProducersByCategory("meat")
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    setError
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      producerOrganizationId: "",
      minimumOrderValueEur: 150,
      leadTimeHours: 24,
      cutOffTimeLocal: "17:00"
    }
  });

  const selectedProducerId = watch("producerOrganizationId");

  const mutation = useMutation({
    mutationFn: createContractDraft,
    onSuccess: (result) => {
      router.push(`/(restaurant)/contracts/${result.contractId}`);
    },
    onError: (error) => {
      setError("producerOrganizationId", {
        message: (error as Error).message
      });
    }
  });

  return (
    <AppScreen>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Nuevo Contrato</Text>
      </View>

      <Text style={styles.subtitle}>Define condiciones base para activar la compra automatizada.</Text>

      <View style={styles.producerList}>
        <Text style={styles.sectionLabel}>Proveedor</Text>
        {producers?.map((producer) => (
          <Pressable
            key={producer.id}
            onPress={() => setValue("producerOrganizationId", producer.id)}
            style={[styles.producerOption, selectedProducerId === producer.id && styles.producerOptionActive]}
          >
            <Text style={styles.producerTitle}>{producer.name}</Text>
            <Text style={styles.producerMeta}>{`⭐ ${producer.rating.toFixed(1)} · ${producer.deliveryFeeEur.toFixed(2)}€ envío`}</Text>
          </Pressable>
        ))}
        {errors.producerOrganizationId ? <Text style={styles.error}>{errors.producerOrganizationId.message}</Text> : null}
      </View>

      <Controller
        control={control}
        name="minimumOrderValueEur"
        render={({ field: { value, onChange } }) => (
          <TextInputField label="Pedido mínimo (€)" value={String(value)} onChangeText={onChange} keyboardType="numeric" error={errors.minimumOrderValueEur?.message} />
        )}
      />

      <Controller
        control={control}
        name="leadTimeHours"
        render={({ field: { value, onChange } }) => (
          <TextInputField label="Lead time (horas)" value={String(value)} onChangeText={onChange} keyboardType="numeric" error={errors.leadTimeHours?.message} />
        )}
      />

      <Controller
        control={control}
        name="cutOffTimeLocal"
        render={({ field: { value, onChange } }) => (
          <TextInputField label="Hora de corte" value={value} onChangeText={onChange} placeholder="17:00" error={errors.cutOffTimeLocal?.message} />
        )}
      />

      <PrimaryButton
        title={isSubmitting || mutation.isPending ? "Creando..." : "Crear borrador"}
        onPress={handleSubmit((values) => {
          if (!roleSession.organizationId) {
            setError("producerOrganizationId", { message: "No se encontró tu organización" });
            return;
          }

          mutation.mutate({
            producerOrganizationId: values.producerOrganizationId,
            restaurantOrganizationId: roleSession.organizationId,
            terms: {
              minimumOrderValueEur: values.minimumOrderValueEur,
              minimumOrderWeightKg: 10,
              leadTimeHours: values.leadTimeHours,
              defaultDeliveryFeeEur: 11.09,
              cutOffTimeLocal: values.cutOffTimeLocal,
              deliveryWindowIds: [],
              serviceZoneIds: [],
              productPriceOverrides: [],
              cancellationWindowMinutes: 120
            },
            changeNote: "Borrador generado desde app restaurante"
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
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontWeight: "700"
  },
  producerList: {
    gap: 8
  },
  producerOption: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    backgroundColor: colors.bgDarkSoft,
    gap: 2
  },
  producerOptionActive: {
    borderColor: colors.brand,
    backgroundColor: "rgba(77,174,87,0.15)"
  },
  producerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700"
  },
  producerMeta: {
    color: colors.textSecondary,
    fontSize: 12
  },
  error: {
    color: colors.danger,
    fontSize: 12
  }
});
