import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, elevation, fonts, radius } from "../lib/theme";
import { formatEuro } from "../lib/dates";
import { DemoCategoryCode, buildImageFallbackChain } from "../lib/demoMedia";
import { AppImage } from "./AppImage";
import type { AppImageSource, AppImageSourceInput } from "../lib/imageSources";

type Props = {
  name: string;
  subtitle: string;
  price: number;
  imageSource?: AppImageSource;
  fallbackSource?: AppImageSourceInput;
  category?: DemoCategoryCode;
  badge?: string;
  onPress: () => void;
  onPressIn?: () => void;
  onAdd: () => void;
};

export function ProductRow({
  name,
  subtitle,
  price,
  imageSource,
  fallbackSource,
  category = "produce",
  badge,
  onPress,
  onPressIn,
  onAdd
}: Props) {
  const resolvedFallbackSource = fallbackSource ?? buildImageFallbackChain(category);

  return (
    <Pressable style={styles.row} onPress={onPress} onPressIn={onPressIn}>
      <AppImage source={imageSource} fallbackSource={resolvedFallbackSource} style={styles.imagePlaceholder} borderRadius={14} />
      <View style={styles.textContainer}>
        {badge ? <Text style={styles.badge}>{badge}</Text> : null}
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        <Text style={styles.price}>{formatEuro(price)}</Text>
      </View>
      <Pressable style={styles.addButton} onPress={onAdd}>
        <MaterialCommunityIcons name="plus" size={24} color="#1A1A18" />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightSurface,
    borderRadius: radius.lg,
    padding: 12,
    borderWidth: 2,
    borderColor: "#D3B992",
    gap: 12,
    ...elevation.level1
  },
  imagePlaceholder: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: "#D9D9D9"
  },
  textContainer: {
    flex: 1,
    gap: 3
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: "#C7A679",
    backgroundColor: "#F5E6D3",
    paddingHorizontal: 9,
    paddingVertical: 3,
    color: "#6D3F24",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.45,
    fontFamily: fonts.bodyBold
  },
  name: {
    color: colors.textStrong,
    fontSize: 20,
    fontFamily: fonts.bodyBold
  },
  subtitle: {
    color: colors.textSoftDark,
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.bodyStrong
  },
  price: {
    color: colors.textStrong,
    fontSize: 19,
    fontFamily: fonts.bodyBold
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.actionPrimary,
    alignItems: "center",
    justifyContent: "center",
    ...elevation.level1
  }
});
