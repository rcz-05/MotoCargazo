import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../components/AppScreen";
import { EmptyState } from "../../components/EmptyState";
import { PrimaryButton } from "../../components/PrimaryButton";
import { AppImage } from "../../components/AppImage";
import { categoryCover, sevilleMap } from "../../lib/demoMedia";
import { useCartStore } from "../../store/cart-store";
import { colors, fonts, radius, spacing } from "../../lib/theme";

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const setItemQuantity = useCartStore((state) => state.setItemQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = useCartStore((state) => state.getSubtotal());

  const deliveryFee = 3.99;
  const serviceFee = 0.3;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <AppScreen scroll={false} dark={false} backgroundColor={colors.bgLight} style={styles.root}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.productId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <View style={styles.navRow}>
              <Pressable onPress={() => router.back()} style={styles.iconButton}>
                <MaterialCommunityIcons name="chevron-left" size={20} color={colors.textStrong} />
              </Pressable>
              <Text style={styles.title}>Tu pedido</Text>
              <View style={styles.iconButtonPlaceholder} />
            </View>
            <Text style={styles.subtitle}>{items.length ? `${items.length} producto${items.length > 1 ? "s" : ""}` : "Carrito vacío"}</Text>
          </View>
        }
        ListEmptyComponent={<EmptyState light title="Tu carrito está vacío" subtitle="Añade productos para continuar al checkout." />}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <AppImage
              source={item.imageSource ?? item.imageUrl}
              fallbackSource={categoryCover[item.category]}
              style={styles.itemImage}
              borderRadius={14}
            />
            <View style={styles.itemMeta}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemInfo}>{`${item.unitPriceEur.toFixed(2)}€ · ${item.unit}`}</Text>
              <Text style={styles.itemTotal}>{`${(item.unitPriceEur * item.quantity).toFixed(2)}€`}</Text>
            </View>

            <View style={styles.itemActions}>
              <Pressable style={styles.stepperBtn} onPress={() => setItemQuantity(item.productId, item.quantity - 1)}>
                <MaterialCommunityIcons name="minus" size={16} color={colors.brandDark} />
              </Pressable>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Pressable style={styles.stepperBtn} onPress={() => setItemQuantity(item.productId, item.quantity + 1)}>
                <MaterialCommunityIcons name="plus" size={16} color={colors.brandDark} />
              </Pressable>
              <Pressable onPress={() => removeItem(item.productId)}>
                <Text style={styles.remove}>Quitar</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListFooterComponent={
          items.length > 0 ? (
            <View style={styles.footerStack}>
              <View style={styles.detailCard}>
                <Text style={styles.detailTitle}>Detalles de la entrega</Text>
                <AppImage source={sevilleMap} fallbackSource={categoryCover.produce} style={styles.mapImage} borderRadius={radius.md} />
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="flag-variant-outline" size={15} color={colors.textStrong} />
                  <Text style={styles.detailText}>Casco Antiguo, Sevilla · Ventana hoy 06:00-08:00</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="bike" size={15} color={colors.textStrong} />
                  <Text style={styles.detailText}>Reparto con vehículo eléctrico compatible</Text>
                </View>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumen</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Productos</Text>
                  <Text style={styles.summaryValue}>{`${subtotal.toFixed(2)}€`}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Envío</Text>
                  <Text style={styles.summaryValue}>{`${deliveryFee.toFixed(2)}€`}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Gastos de gestión</Text>
                  <Text style={styles.summaryValue}>{`${serviceFee.toFixed(2)}€`}</Text>
                </View>
                <View style={styles.summaryRowTotal}>
                  <Text style={styles.summaryTotalLabel}>TOTAL</Text>
                  <Text style={styles.summaryTotalValue}>{`${total.toFixed(2)}€`}</Text>
                </View>
              </View>

              <PrimaryButton title="Continuar a checkout" onPress={() => router.push("/(restaurant)/checkout")} />
            </View>
          ) : null
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.md
  },
  content: {
    gap: 12,
    paddingBottom: 24
  },
  headerWrap: {
    gap: 4,
    marginBottom: 4
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    alignItems: "center",
    justifyContent: "center"
  },
  iconButtonPlaceholder: {
    width: 36,
    height: 36
  },
  title: {
    color: colors.textStrong,
    fontSize: 32,
    lineHeight: 37,
    fontFamily: fonts.heading
  },
  subtitle: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  },
  itemRow: {
    flexDirection: "row",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 10,
    gap: 10,
    alignItems: "center"
  },
  itemImage: {
    width: 78,
    height: 78,
    borderRadius: 14,
    backgroundColor: "#d8d8d8"
  },
  itemMeta: {
    flex: 1,
    gap: 2
  },
  itemName: {
    color: colors.textStrong,
    fontSize: 16,
    fontFamily: fonts.bodyStrong
  },
  itemInfo: {
    color: colors.textSoftDark,
    fontSize: 12,
    fontFamily: fonts.body
  },
  itemTotal: {
    color: colors.textStrong,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  itemActions: {
    alignItems: "center",
    gap: 5
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.actionPrimaryBorder,
    backgroundColor: colors.actionPrimaryHighlight,
    alignItems: "center",
    justifyContent: "center"
  },
  qty: {
    color: colors.textStrong,
    fontSize: 15,
    fontFamily: fonts.bodyStrong
  },
  remove: {
    color: colors.textSoftDark,
    fontSize: 11,
    fontFamily: fonts.body
  },
  footerStack: {
    marginTop: 2,
    gap: 10
  },
  detailCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 12,
    gap: 8
  },
  detailTitle: {
    color: colors.textStrong,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: fonts.heading
  },
  mapImage: {
    height: 126,
    width: "100%",
    borderRadius: radius.md,
    backgroundColor: "#d8d8d8"
  },
  detailRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center"
  },
  detailText: {
    flex: 1,
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  },
  summaryCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 12,
    gap: 8
  },
  summaryTitle: {
    color: colors.textStrong,
    fontSize: 26,
    lineHeight: 30,
    fontFamily: fonts.heading
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  summaryLabel: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.body
  },
  summaryValue: {
    color: colors.textStrong,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  summaryRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2
  },
  summaryTotalLabel: {
    color: colors.textStrong,
    fontSize: 19,
    lineHeight: 24,
    fontFamily: fonts.heading
  },
  summaryTotalValue: {
    color: colors.textStrong,
    fontSize: 21,
    lineHeight: 25,
    fontFamily: fonts.heading
  }
});
