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
    backgroundColor: colors.lightSurfaceSoft
  },
  lightNeutral: {
    borderColor: colors.lightBorder,
    backgroundColor: "#f4f7fa"
  },
  success: {
    borderColor: colors.brand,
    backgroundColor: "rgba(77,174,87,0.2)"
  },
  warning: {
    borderColor: colors.warning,
    backgroundColor: "rgba(228,178,79,0.18)"
  },
  label: {
    color: colors.textPrimary,
    fontFamily: fonts.bodyStrong,
    fontSize: 12
  },
  labelLight: {
    color: colors.textStrong
  }
});
