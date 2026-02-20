import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients, spacing } from "../lib/theme";

type Props = PropsWithChildren<{
  scroll?: boolean;
  style?: ViewStyle;
  dark?: boolean;
  brand?: boolean;
  contentContainerStyle?: ViewStyle;
  backgroundColor?: string;
}>;

export function AppScreen({
  children,
  scroll = true,
  style,
  dark = true,
  brand = false,
  contentContainerStyle,
  backgroundColor
}: Props) {
  const gradientColors = dark
    ? gradients.darkScreen
    : brand
      ? gradients.lightScreen
      : ([backgroundColor ?? colors.bgLight, backgroundColor ?? colors.bgLight] as const);

  if (scroll) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: gradientColors[0] }]}>
        <LinearGradient colors={gradientColors} style={[styles.gradient, style]}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: gradientColors[0] }]}>
      <LinearGradient colors={gradientColors} style={[styles.gradient, style]}>
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gradient: {
    flex: 1
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xxl
  }
});
