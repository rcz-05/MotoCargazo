import { Link } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppScreen } from "../../components/AppScreen";
import { PrimaryButton } from "../../components/PrimaryButton";
import { TextInputField } from "../../components/TextInputField";
import { supabase } from "../../lib/supabase";
import { colors, fonts, radius } from "../../lib/theme";
import { mapForgotPasswordError } from "../../lib/authErrors";

const schema = z.object({
  email: z.string().email("Email inválido")
});

type Values = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const [formMessage, setFormMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (values: Values) => {
    setFormMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email.trim().toLowerCase());

      if (error) {
        setError("email", {
          message: mapForgotPasswordError(error)
        });
        return;
      }

      setFormMessage({
        type: "success",
        text: "Hemos enviado instrucciones a tu correo."
      });
    } catch (error) {
      setError("email", {
        message: mapForgotPasswordError(error)
      });
    }
  };

  return (
    <AppScreen dark={false} style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Recuperar contraseña</Text>
        <Text style={styles.heroSubtitle}>Te enviaremos un enlace para restablecer tu acceso.</Text>
      </View>

      <View style={styles.formCard}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextInputField
              light
              label="Email"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              placeholder="restaurante@dominio.es"
              error={errors.email?.message}
            />
          )}
        />

        {formMessage ? <Text style={[styles.formMessage, formMessage.type === "success" && styles.formMessageSuccess]}>{formMessage.text}</Text> : null}

        <PrimaryButton title={isSubmitting ? "Enviando..." : "Enviar enlace"} onPress={handleSubmit(onSubmit)} disabled={isSubmitting} />

        <Link href="/(auth)/login" style={styles.link}>
          Volver a iniciar sesión
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
    padding: 16,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface
  },
  formMessage: {
    color: "#dd3f3f",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body
  },
  formMessageSuccess: {
    color: colors.brandDark
  },
  link: {
    alignSelf: "center",
    color: colors.brandDark,
    fontSize: 15,
    marginTop: 4,
    fontFamily: fonts.bodyStrong
  }
});
