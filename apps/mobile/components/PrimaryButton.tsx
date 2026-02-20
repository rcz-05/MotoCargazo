import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors, fonts, radius } from "../lib/theme";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  dark?: boolean;
  style?: ViewStyle;
  compact?: boolean;
};

export function PrimaryButton({ title, onPress, disabled, dark = false, style, compact = false }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        dark ? styles.dark : styles.light,
        pressed && !disabled ? styles.pressed : undefined,
        disabled ? styles.disabled : undefined,
        style
      ]}
    >
      <Text style={[styles.text, dark ? styles.darkText : styles.lightText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: radius.pill,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    borderWidth: 1,
    shadowColor: "#151515",
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  compact: {
    minHeight: 46
  },
  light: {
    backgroundColor: colors.brand,
    borderColor: colors.brandDark
  },
  dark: {
    backgroundColor: colors.textStrong,
    borderColor: "#29303a"
  },
  text: {
    fontSize: 18,
    fontFamily: fonts.bodyStrong,
    letterSpacing: 0.2
  },
  lightText: {
    color: colors.textDark
  },
  darkText: {
    color: colors.white
  },
  pressed: {
    transform: [{ scale: 0.994 }],
    opacity: 0.95
  },
  disabled: {
    opacity: 0.58
  }
});
