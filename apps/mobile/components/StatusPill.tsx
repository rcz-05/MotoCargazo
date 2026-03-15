import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius } from "../lib/theme";

type Props = {
  label: string;
  type?: "success" | "warning" | "neutral";
  light?: boolean;
};

export function StatusPill({ label, type = "neutral", light = false }: Props) {
  return (
    <View
      style={[
        styles.pill,
        light && styles.pillLight,
        type === "success" && styles.success,
        type === "warning" && styles.warning,
        light && type === "neutral" && styles.lightNeutral
      ]}
    >
      <Text style={[styles.label, light && styles.labelLight]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  pillLight: {
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface
  },
  lightNeutral: {
    borderColor: colors.lightBorder,
    backgroundColor: "#F3EBDD"
  },
  success: {
    borderColor: "#B6D6BF",
    backgroundColor: "#EAF4EC"
  },
  warning: {
    borderColor: "#E6CFAB",
    backgroundColor: "#F9F0DE"
  },
  label: {
    color: colors.textPrimary,
    fontFamily: fonts.bodyStrong,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.3
  },
  labelLight: {
    color: colors.textStrong
  }
});
