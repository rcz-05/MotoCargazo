import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius } from "../lib/theme";
import { formatEuro } from "../lib/dates";

type Props = {
  name: string;
  subtitle: string;
  price: number;
  imageUrl?: string | null;
  onPress: () => void;
  onAdd: () => void;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";

export function ProductRow({ name, subtitle, price, imageUrl, onPress, onAdd }: Props) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Image source={{ uri: imageUrl ?? fallbackImage }} style={styles.imagePlaceholder} />
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {subtitle}
        </Text>
        <Text style={styles.price}>{formatEuro(price)}</Text>
      </View>
      <Pressable style={styles.addButton} onPress={onAdd}>
        <Ionicons name="add" size={20} color={colors.brandDark} />
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
    padding: 11,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    gap: 12
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: "#d9d9d9"
  },
  textContainer: {
    flex: 1,
    gap: 4
  },
  name: {
    color: colors.textStrong,
    fontSize: 17,
    fontFamily: fonts.bodyStrong
  },
  subtitle: {
    color: colors.textSoftDark,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body
  },
  price: {
    color: colors.textStrong,
    fontSize: 15,
    fontFamily: fonts.bodyStrong
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#9ce3b1",
    backgroundColor: "#e8f8ed",
    alignItems: "center",
    justifyContent: "center"
  }
});
