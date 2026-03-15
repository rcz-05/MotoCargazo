import { Link, router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppScreen } from "../../components/AppScreen";
import { PrimaryButton } from "../../components/PrimaryButton";
import { TextInputField } from "../../components/TextInputField";
import { colors, elevation, fonts, radius } from "../../lib/theme";
import { supabase } from "../../lib/supabase";
import { useSession } from "../../lib/session";
import { mapLoginError } from "../../lib/authErrors";
import { motionStagger, useEntranceAnimation, useReducedMotionPreference } from "../../lib/motion";

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

function resolveDemoRole(email: string): "restaurant" | "producer" {
  return email.startsWith("proveedor-") ? "producer" : "restaurant";
}

function isKnownDemoCredentials(email: string, password: string) {
  return (
    (email === "restaurante-demo@motocargo.es" || email === "proveedor-demo@motocargo.es") &&
    password === demoPassword
  );
}

export default function LoginScreen() {
  const { refreshRoleSession, enterDemoSession } = useSession();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const reducedMotion = useReducedMotionPreference();
  const heroMotion = useEntranceAnimation({ delay: motionStagger.screenEnter, reducedMotion });
  const cardMotion = useEntranceAnimation({ delay: motionStagger.screenEnter * 2, reducedMotion });

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
    const normalizedEmail = values.email.trim().toLowerCase();
    const normalizedPassword = values.password.trim();

    if (isKnownDemoCredentials(normalizedEmail, normalizedPassword)) {
      await enterDemoSession(resolveDemoRole(normalizedEmail));
      router.replace("/");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: normalizedPassword
      });

      if (error) {
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
    await enterDemoSession(role);
    router.replace("/");
  };

  return (
    <AppScreen dark={false} style={styles.root} contentContainerStyle={styles.content}>
      <Animated.View style={[styles.hero, heroMotion]}>
        <View style={styles.heroTop}>
          <Text style={styles.heroBrand}>MotoCargo</Text>
          <View style={styles.heroStatus}>
            <Text style={styles.heroStatusText}>Sevilla activa</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>Abastece tu restaurante con ritmo de mercado.</Text>
        <Text style={styles.heroSubtitle}>Pedidos, contratos y entrega urbana en una sola operación.</Text>
      </Animated.View>

      <Animated.View style={[styles.formCard, cardMotion]}>
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
          <Text style={styles.demoTitle}>Acceso demo inmediato</Text>
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
          <Text style={styles.demoHelp}>Clave demo: MotoCargoDemo!2026</Text>
        </View>

        <View style={styles.links}>
          <Link href="/(auth)/register" style={styles.link}>
            Crear cuenta
          </Link>
          <Link href="/(auth)/forgot-password" style={styles.linkMuted}>
            Recuperar contraseña
          </Link>
        </View>
      </Animated.View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 16
  },
  content: {
    gap: 14,
    paddingBottom: 32
  },
  hero: {
    borderRadius: radius.xl,
    backgroundColor: colors.brandYellow,
    paddingHorizontal: 18,
    paddingVertical: 20,
    gap: 8,
    ...elevation.level2
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  heroBrand: {
    color: colors.textStrong,
    fontSize: 24,
    fontFamily: fonts.heading
  },
  heroStatus: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(18,22,25,0.15)",
    backgroundColor: "rgba(255,255,255,0.72)",
    paddingHorizontal: 10,
    minHeight: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  heroStatusText: {
    color: colors.textStrong,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  heroTitle: {
    color: colors.textStrong,
    fontSize: 31,
    lineHeight: 36,
    fontFamily: fonts.heading
  },
  heroSubtitle: {
    color: "#394655",
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
    gap: 12,
    ...elevation.level1
  },
  formTitle: {
    color: colors.textStrong,
    fontSize: 28,
    fontFamily: fonts.heading
  },
  formMessage: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body
  },
  demoPanel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "#d8c29a",
    backgroundColor: "#f9f0dc",
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
    borderWidth: 2,
    borderColor: colors.actionPrimaryBorder,
    backgroundColor: colors.actionPrimary,
    justifyContent: "center",
    alignItems: "center"
  },
  demoButtonText: {
    color: "#f8f7f1",
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  },
  demoHelp: {
    color: colors.textSoftDark,
    fontSize: 12,
    fontFamily: fonts.body
  },
  links: {
    alignItems: "center",
    gap: 8
  },
  link: {
    color: colors.brandDark,
    fontSize: 16,
    fontFamily: fonts.bodyStrong
  },
  linkMuted: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.body
  }
});
