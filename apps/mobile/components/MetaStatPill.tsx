import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fonts, radius } from "../lib/theme";

type Props = {
  icon: string;
  label: string;
  emphasis?: "default" | "success" | "warning";
};

function resolveIcon(icon: string): keyof typeof MaterialCommunityIcons.glyphMap {
  const map: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    "thumbs-up-outline": "thumb-up-outline",
    "time-outline": "clock-outline",
    "bicycle-outline": "bike",
    "star": "star",
    "checkmark": "check",
    "checkmark-circle": "check-circle",
    "refresh-outline": "refresh",
    "cart-outline": "cart-outline",
    "document-text-outline": "file-document-outline"
  };

  return map[icon] ?? (icon as keyof typeof MaterialCommunityIcons.glyphMap);
}

export function MetaStatPill({ icon, label, emphasis = "default" }: Props) {
  const resolved = resolveIcon(icon);

  return (
    <View style={[styles.pill, emphasis === "success" && styles.success, emphasis === "warning" && styles.warning]}>
      <MaterialCommunityIcons
        name={resolved}
        size={12}
        color={emphasis === "success" ? "#32744D" : emphasis === "warning" ? "#8A611F" : colors.textStrong}
      />
      <Text style={[styles.label, emphasis === "success" && styles.successText, emphasis === "warning" && styles.warningText]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    paddingHorizontal: 9,
    minHeight: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  success: {
    borderColor: "#B6D6BF",
    backgroundColor: "#EAF4EC"
  },
  warning: {
    borderColor: "#E5CFAB",
    backgroundColor: "#F9F0DF"
  },
  label: {
    color: colors.textStrong,
    fontSize: 12,
    fontFamily: fonts.bodyBold
  },
  successText: {
    color: "#32744D"
  },
  warningText: {
    color: "#8A611F"
  }
});
