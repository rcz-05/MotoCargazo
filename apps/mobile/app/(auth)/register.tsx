import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppScreen } from "../../components/AppScreen";
import { PrimaryButton } from "../../components/PrimaryButton";
import { TextInputField } from "../../components/TextInputField";
import { colors, fonts, radius } from "../../lib/theme";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../lib/session";
import { mapRegisterError } from "../../lib/authErrors";

const registerSchema = z.object({
  fullName: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["restaurant", "producer"])
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const { refreshRoleSession, enterDemoSession } = useSession();
  const [formMessage, setFormMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "restaurant"
    }
  });

  const selectedRole = watch("role");

  const onSubmit = async (values: RegisterValues) => {
    setFormMessage(null);
    const normalizedEmail = values.email.trim().toLowerCase();

    try {
      if (values.role === "producer") {
        const { data: invite, error: inviteError } = await supabase
          .from("invitations")
          .select("id, expires_at, status")
          .eq("email", normalizedEmail)
          .eq("role", "producer")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (inviteError) {
          setError("email", { message: "No se pudo validar la invitación del proveedor" });
          return;
        }

        if (!invite) {
          setError("email", { message: "El alta de proveedores es solo por invitación activa" });
          return;
        }

        if (new Date(invite.expires_at).getTime() < Date.now()) {
          setError("email", { message: "La invitación del proveedor está vencida" });
          return;
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            requested_role: values.role
          }
        }
      });

      if (error) {
        setFormMessage({ type: "error", text: mapRegisterError(error) });
        return;
      }

      if (!data.session) {
        setFormMessage({
          type: "info",
          text: "Cuenta creada. Revisa tu correo para confirmar y después inicia sesión."
        });
        return;
      }

      await refreshRoleSession();
      router.replace("/");
    } catch (error) {
      const mapped = mapRegisterError(error);
      if (mapped.toLowerCase().includes("network")) {
        setFormMessage({
          type: "error",
          text: "No hay conexión con Auth local. Puedes usar el modo demo para continuar el recorrido."
        });
        return;
      }
      setFormMessage({ type: "error", text: mapped });
    }
  };

  return (
    <AppScreen dark={false} style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Crear cuenta</Text>
        <Text style={styles.heroSubtitle}>Empieza a operar compras de cocina con un flujo profesional.</Text>
      </View>

      <View style={styles.formCard}>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { value, onChange } }) => (
            <TextInputField
              light
              label="Nombre completo"
              value={value}
              onChangeText={onChange}
              placeholder="María López"
              error={errors.fullName?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextInputField
              light
              label="Email"
              value={value}
              onChangeText={onChange}
              placeholder="empresa@dominio.es"
              keyboardType="email-address"
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <TextInputField
              light
              label="Contraseña"
              value={value}
              onChangeText={onChange}
              placeholder="******"
              secureTextEntry
              error={errors.password?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="role"
          render={({ field: { value, onChange } }) => (
            <View style={styles.roleBlock}>
              <Text style={styles.roleLabel}>Tipo de cuenta</Text>
              <View style={styles.roleRow}>
                {[
                  { label: "Restaurante", value: "restaurant" },
                  { label: "Proveedor", value: "producer" }
                ].map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => onChange(option.value as RegisterValues["role"])}
                    style={[styles.roleButton, value === option.value && styles.roleButtonActive]}
                  >
                    <Text style={[styles.roleText, value === option.value && styles.roleTextActive]}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        />

        {selectedRole === "producer" ? (
          <Text style={styles.helper}>Alta de proveedor con invitación activa. Demo: proveedor-demo@motocargo.es</Text>
        ) : null}

        {formMessage ? (
          <Text style={[styles.formMessage, formMessage.type === "info" && styles.formMessageInfo]}>{formMessage.text}</Text>
        ) : null}

        <PrimaryButton title={isSubmitting ? "Creando..." : "Crear cuenta"} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />

        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>Continuar sin bloqueo (demo)</Text>
          <View style={styles.demoActions}>
            <Pressable
              style={styles.demoButton}
              onPress={async () => {
                await enterDemoSession("restaurant");
                router.replace("/");
              }}
            >
              <Text style={styles.demoButtonText}>Restaurante demo</Text>
            </Pressable>
            <Pressable
              style={styles.demoButton}
              onPress={async () => {
                await enterDemoSession("producer");
                router.replace("/");
              }}
            >
              <Text style={styles.demoButtonText}>Proveedor demo</Text>
            </Pressable>
          </View>
        </View>

        <Link href="/(auth)/login" style={styles.link}>
          Ya tengo cuenta
        </Link>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16
  },
  content: {
    gap: 14,
    paddingBottom: 30
  },
  hero: {
    borderRadius: radius.xl,
    backgroundColor: colors.brandYellow,
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 6
  },
  heroTitle: {
    color: colors.textStrong,
    fontSize: 34,
    lineHeight: 40,
    fontFamily: fonts.heading
  },
  heroSubtitle: {
    color: "#364252",
    fontSize: 15,
    lineHeight: 21,
    fontFamily: fonts.body
  },
  formCard: {
    gap: 12,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 16
  },
  roleBlock: {
    gap: 8
  },
  roleLabel: {
    color: colors.textStrong,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  roleRow: {
    flexDirection: "row",
    gap: 10
  },
  roleButton: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurfaceSoft,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center"
  },
  roleButtonActive: {
    borderColor: colors.brand,
    backgroundColor: "#e8f8ed"
  },
  roleText: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  roleTextActive: {
    color: colors.brandDark
  },
  helper: {
    color: colors.textSoftDark,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: fonts.body
  },
  demoBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurfaceSoft,
    padding: 10,
    gap: 8
  },
  demoTitle: {
    color: colors.textStrong,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  },
  demoActions: {
    flexDirection: "row",
    gap: 8
  },
  demoButton: {
    flex: 1,
    minHeight: 38,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#bde9c8",
    backgroundColor: "#eaf9ee",
    justifyContent: "center",
    alignItems: "center"
  },
  demoButtonText: {
    color: colors.brandDark,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  formMessage: {
    color: "#dd3f3f",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body
  },
  formMessageInfo: {
    color: colors.brandDark
  },
  link: {
    marginTop: 8,
    alignSelf: "center",
    color: colors.brandDark,
    fontSize: 15,
    fontFamily: fonts.bodyStrong
  }
});
