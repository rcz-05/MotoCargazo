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
import { mapLoginError } from "../../lib/authErrors";

const loginSchema = z.object({
  email: z.string().email("Introduce un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

type LoginValues = z.infer<typeof loginSchema>;

const demoAccounts = [
  { label: "Restaurante", email: "restaurante-demo@motocargo.es" },
  { label: "Proveedor", email: "proveedor-demo@motocargo.es" }
];
const demoPassword = "MotoCargoDemo!2026";

export default function LoginScreen() {
  const { refreshRoleSession, enterDemoSession } = useSession();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (values: LoginValues) => {
    setFormMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email.trim().toLowerCase(),
        password: values.password
      });

      if (error) {
        const normalizedEmail = values.email.trim().toLowerCase();
        if (error.message.toLowerCase().includes("network") && normalizedEmail.includes("-demo@motocargo.es")) {
          const role = normalizedEmail.startsWith("proveedor-") ? "producer" : "restaurant";
          await enterDemoSession(role);
          router.replace("/");
          return;
        }
        setFormMessage(mapLoginError(error));
        return;
      }

      await refreshRoleSession();
      router.replace("/");
    } catch (error) {
      setFormMessage(mapLoginError(error));
    }
  };

  const signInWithDemo = async (role: "restaurant" | "producer", email: string) => {
    setFormMessage(null);
    setValue("email", email);
    setValue("password", demoPassword);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: demoPassword
      });

      if (error) {
        await enterDemoSession(role);
        router.replace("/");
        return;
      }

      await refreshRoleSession();
      router.replace("/");
    } catch {
      await enterDemoSession(role);
      router.replace("/");
    }
  };

  return (
    <AppScreen dark={false} style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroBrand}>MotoCargo</Text>
        <Text style={styles.heroTitle}>Compras B2B para hostelería, sin fricción.</Text>
        <Text style={styles.heroSubtitle}>Centraliza proveedores, contratos y pedidos en una sola operación.</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Inicia sesión</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextInputField
              light
              label="Email"
              value={value}
              onChangeText={onChange}
              placeholder="restaurante@dominio.es"
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

        {formMessage ? <Text style={styles.formMessage}>{formMessage}</Text> : null}

        <PrimaryButton title={isSubmitting ? "Entrando..." : "Entrar"} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />

        <View style={styles.demoPanel}>
          <Text style={styles.demoTitle}>Acceso demo</Text>
          <View style={styles.demoRow}>
            {demoAccounts.map((account) => (
              <Pressable
                key={account.email}
                style={styles.demoButton}
                onPress={() => signInWithDemo(account.label === "Proveedor" ? "producer" : "restaurant", account.email)}
              >
                <Text style={styles.demoButtonText}>{account.label}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.demoHelp}>Clave: MotoCargoDemo!2026</Text>
        </View>

        <View style={styles.links}>
          <Link href="/(auth)/register" style={styles.link}>
            Crear cuenta
          </Link>
          <Link href="/(auth)/forgot-password" style={styles.linkMuted}>
            Recuperar contraseña
          </Link>
        </View>
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
    paddingBottom: 34
  },
  hero: {
    borderRadius: radius.xl,
    backgroundColor: colors.brandYellow,
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 8
  },
  heroBrand: {
    color: colors.textStrong,
    fontSize: 22,
    fontFamily: fonts.heading
  },
  heroTitle: {
    color: colors.textStrong,
    fontSize: 29,
    lineHeight: 35,
    fontFamily: fonts.heading
  },
  heroSubtitle: {
    color: "#364252",
    fontSize: 15,
    lineHeight: 21,
    fontFamily: fonts.body
  },
  formCard: {
    backgroundColor: colors.lightSurface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    padding: 16,
    gap: 12
  },
  formTitle: {
    color: colors.textStrong,
    fontSize: 26,
    fontFamily: fonts.heading
  },
  formMessage: {
    color: "#dd3f3f",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body
  },
  demoPanel: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurfaceSoft,
    padding: 12,
    gap: 8
  },
  demoTitle: {
    color: colors.textStrong,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  demoRow: {
    flexDirection: "row",
    gap: 8
  },
  demoButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: "#bde9c8",
    backgroundColor: "#eaf9ee",
    justifyContent: "center",
    alignItems: "center"
  },
  demoButtonText: {
    color: colors.brandDark,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  },
  demoHelp: {
    color: colors.textSoftDark,
    fontSize: 12,
    fontFamily: fonts.body
  },
  links: {
    marginTop: 4,
    gap: 8,
    alignItems: "center"
  },
  link: {
    color: colors.brandDark,
    fontSize: 16,
    fontFamily: fonts.bodyStrong
  },
  linkMuted: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  }
});
