import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, fonts, radius } from "../lib/theme";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric";
  error?: string;
  light?: boolean;
};

export function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = "default",
  error,
  light = false
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, light && styles.labelLight]}>{label}</Text>
      <TextInput
        style={[styles.input, light ? styles.inputLight : styles.inputDark, error ? styles.inputError : undefined]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={light ? colors.textSoftDark : colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        selectionColor={colors.brand}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 7
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  labelLight: {
    color: colors.textStrong
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 17,
    fontFamily: fonts.body
  },
  inputDark: {
    backgroundColor: colors.bgCard,
    borderColor: colors.borderSoft,
    color: colors.textPrimary
  },
  inputLight: {
    backgroundColor: colors.lightSurfaceSoft,
    borderColor: colors.lightBorder,
    color: colors.textStrong
  },
  inputError: {
    borderColor: colors.danger
  },
  error: {
    color: "#ff6f6f",
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.body
  }
});
