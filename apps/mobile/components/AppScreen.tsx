import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
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
      ? gradients.marketHero
      : ([backgroundColor ?? colors.bgLight, backgroundColor ?? colors.bgLight] as const);

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: gradientColors[0] }]}> 
      <LinearGradient colors={gradientColors} style={[styles.gradient, style]}>
        {!dark ? (
          <>
            <View pointerEvents="none" style={styles.meshTop} />
            <View pointerEvents="none" style={styles.meshBottom} />
            <View pointerEvents="none" style={styles.noiseStripe} />
          </>
        ) : null}
        {body}
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
  },
  meshTop: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    top: -120,
    right: -120,
    backgroundColor: "rgba(166,106,67,0.12)"
  },
  meshBottom: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: -120,
    left: -90,
    backgroundColor: "rgba(47,111,115,0.08)"
  },
  noiseStripe: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 10,
    height: 1,
    backgroundColor: "rgba(31,26,22,0.08)"
  }
});
