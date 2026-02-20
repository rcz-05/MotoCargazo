import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius } from "../lib/theme";

type Props = {
  title: string;
  subtitle?: string;
  light?: boolean;
};

export function EmptyState({ title, subtitle, light = false }: Props) {
  return (
    <View style={[styles.container, light && styles.containerLight]}>
      <Text style={[styles.title, light && styles.titleLight]}>{title}</Text>
      {subtitle ? <Text style={[styles.subtitle, light && styles.subtitleLight]}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: colors.bgCard
  },
  containerLight: {
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface
  },
  title: {
    color: colors.textPrimary,
    fontSize: 21,
    fontFamily: fonts.heading,
    textAlign: "center"
  },
  titleLight: {
    color: colors.textStrong
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
    fontFamily: fonts.body
  },
  subtitleLight: {
    color: colors.textSoftDark
  }
});
