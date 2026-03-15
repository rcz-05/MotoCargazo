import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { colors, elevation, fonts, radius } from "../lib/theme";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  dark?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  style?: ViewStyle;
  compact?: boolean;
};

export function PrimaryButton({
  title,
  onPress,
  disabled,
  dark = false,
  variant,
  style,
  compact = false
}: Props) {
  const resolvedVariant = dark ? "ghost" : (variant ?? "primary");

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        resolvedVariant === "primary" && styles.primary,
        resolvedVariant === "secondary" && styles.secondary,
        resolvedVariant === "ghost" && styles.ghost,
        pressed && !disabled && resolvedVariant === "primary" ? styles.primaryPressed : undefined,
        pressed && !disabled ? styles.pressed : undefined,
        disabled ? styles.disabled : undefined,
        style
      ]}
    >
      <Text
        style={[
          styles.text,
          resolvedVariant === "primary" && styles.primaryText,
          resolvedVariant === "secondary" && styles.secondaryText,
          resolvedVariant === "ghost" && styles.ghostText
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 60,
    borderRadius: radius.pill,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    ...elevation.level1
  },
  primary: {
    backgroundColor: colors.actionPrimary
  },
  primaryPressed: {
    backgroundColor: colors.actionPrimaryPressed
  },
  compact: {
    minHeight: 52
  },
  secondary: {
    backgroundColor: colors.actionSecondary,
    borderColor: colors.actionSecondaryBorder,
    borderWidth: 2,
    ...elevation.level1
  },
  ghost: {
    backgroundColor: colors.actionGhost,
    borderColor: colors.lightBorder,
    borderWidth: 2
  },
  text: {
    fontSize: 19,
    fontFamily: fonts.bodyBold,
    letterSpacing: 0.1
  },
  primaryText: {
    color: "#1A1A18"
  },
  secondaryText: {
    color: colors.brandDark
  },
  ghostText: {
    color: colors.textStrong
  },
  pressed: {
    transform: [{ scale: 0.986 }],
    opacity: 0.94
  },
  disabled: {
    opacity: 0.52
  }
});
