import { Redirect, router } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { TextInputField } from "../../../components/TextInputField";
import { createContractDraft, fetchProducersByCategory } from "../../../lib/api";
import { isDemoApp } from "../../../lib/app-mode";
import { useSession } from "../../../lib/session";
import { colors, elevation, fonts, radius } from "../../../lib/theme";

const schema = z.object({
  producerOrganizationId: z.string().uuid("Selecciona un proveedor"),
  minimumOrderValueEur: z.coerce.number().min(0),
  leadTimeHours: z.coerce.number().int().min(1),
  cutOffTimeLocal: z.string().min(4)
});

type FormValues = z.infer<typeof schema>;

export default function NewContractScreen() {
  if (isDemoApp) {
    return <Redirect href="/(restaurant)" />;
  }

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
    <AppScreen dark={false} backgroundColor={colors.bgLight}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={18} color={colors.textStrong} />
        </Pressable>
        <Text style={styles.title}>Nuevo contrato</Text>
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
            <Text style={styles.producerMeta}>{`Rating ${producer.rating.toFixed(1)} · ${producer.deliveryFeeEur.toFixed(2)}€ envío`}</Text>
          </Pressable>
        ))}
        {errors.producerOrganizationId ? <Text style={styles.error}>{errors.producerOrganizationId.message}</Text> : null}
      </View>

      <Controller
        control={control}
        name="minimumOrderValueEur"
        render={({ field: { value, onChange } }) => (
          <TextInputField
            light
            label="Pedido mínimo (€)"
            value={String(value)}
            onChangeText={onChange}
            keyboardType="numeric"
            error={errors.minimumOrderValueEur?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="leadTimeHours"
        render={({ field: { value, onChange } }) => (
          <TextInputField
            light
            label="Lead time (horas)"
            value={String(value)}
            onChangeText={onChange}
            keyboardType="numeric"
            error={errors.leadTimeHours?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="cutOffTimeLocal"
        render={({ field: { value, onChange } }) => (
          <TextInputField
            light
            label="Hora de corte"
            value={value}
            onChangeText={onChange}
            placeholder="17:00"
            error={errors.cutOffTimeLocal?.message}
          />
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
    lineHeight: 36,
    fontFamily: fonts.heading
  },
  subtitle: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.body
  },
  sectionLabel: {
    color: colors.textStrong,
    textTransform: "uppercase",
    letterSpacing: 0.3,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  producerList: {
    gap: 8
  },
  producerOption: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    padding: 12,
    backgroundColor: colors.lightSurface,
    gap: 2,
    ...elevation.level1
  },
  producerOptionActive: {
    borderColor: colors.brandDark,
    backgroundColor: colors.brandSoft
  },
  producerTitle: {
    color: colors.textStrong,
    fontSize: 16,
    fontFamily: fonts.bodyStrong
  },
  producerMeta: {
    color: colors.textSoftDark,
    fontSize: 12,
    fontFamily: fonts.body
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    fontFamily: fonts.body
  }
});
