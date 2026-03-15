import { Pressable, StyleSheet, Text } from "react-native";
import { colors, elevation, fonts, radius } from "../lib/theme";

type Props = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export function FilterChip({ label, selected = false, disabled = false, onPress }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        pressed && !disabled && styles.chipPressed,
        disabled && styles.chipDisabled
      ]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 40,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
    ...elevation.level1
  },
  chipSelected: {
    borderColor: colors.brandDark,
    backgroundColor: "#F0E0CF"
  },
  chipPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }]
  },
  chipDisabled: {
    opacity: 0.45
  },
  label: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.bodyBold
  },
  labelSelected: {
    color: colors.brandDark
  }
});
