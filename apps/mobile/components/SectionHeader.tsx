import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, fonts, spacing } from "../lib/theme";

type Props = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
  light?: boolean;
};

export function SectionHeader({ title, subtitle, actionLabel, onActionPress, light = true }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.textWrap}>
        <Text style={[styles.title, !light && styles.titleDark]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, !light && styles.subtitleDark]}>{subtitle}</Text> : null}
      </View>
      {actionLabel && onActionPress ? (
        <Pressable style={styles.action} onPress={onActionPress}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <MaterialCommunityIcons name="arrow-right" size={14} color={colors.brandDark} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  textWrap: {
    flex: 1,
    gap: 4
  },
  title: {
    color: colors.textStrong,
    fontSize: 34,
    lineHeight: 38,
    fontFamily: fonts.heading
  },
  titleDark: {
    color: colors.textPrimary
  },
  subtitle: {
    color: colors.textSoftDark,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.bodyStrong
  },
  subtitleDark: {
    color: colors.textSecondary
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minHeight: 26
  },
  actionText: {
    color: colors.brandDark,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    fontFamily: fonts.bodyStrong
  }
});
