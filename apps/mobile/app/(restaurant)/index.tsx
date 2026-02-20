import { router } from "expo-router";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "../../components/AppScreen";
import { EmptyState } from "../../components/EmptyState";
import { fetchProducersByCategory } from "../../lib/api";
import { categoryVisuals, producerCardImage } from "../../lib/showcase";
import { useSession } from "../../lib/session";
import { colors, fonts, radius, spacing } from "../../lib/theme";
import { useCartStore } from "../../store/cart-store";

const categories = [
  { code: "meat", label: "Carnes" },
  { code: "seafood", label: "Mariscos" },
  { code: "produce", label: "Frutas y verduras" }
] as const;

export default function RestaurantHomeScreen() {
  const { roleSession, signOut } = useSession();
  const cartCount = useCartStore((state) => state.items.length);

  const categoryQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: ["home-providers", category.code],
      queryFn: () => fetchProducersByCategory(category.code)
    }))
  });

  const featuredProviders = useMemo(() => {
    const grouped = categoryQueries.flatMap((query) => query.data ?? []);
    const unique = new Map(grouped.map((producer) => [producer.id, producer]));
    return [...unique.values()].slice(0, 6);
  }, [categoryQueries]);

  const hasError = categoryQueries.some((query) => query.error);
  const isLoading = categoryQueries.every((query) => query.isLoading);

  return (
    <AppScreen dark={false} backgroundColor={colors.bgLight} style={styles.root}>
      <View style={styles.topHero}>
        <View style={styles.topRow}>
          <Pressable style={styles.avatarButton}>
            <Ionicons name="person-outline" size={19} color={colors.textStrong} />
          </Pressable>
          <Pressable style={styles.searchBar} onPress={() => router.push("/(restaurant)/providers/meat")}>
            <Ionicons name="search-outline" size={18} color={colors.textSoftDark} />
            <Text style={styles.searchText}>¿Qué necesitas hoy?</Text>
          </Pressable>
          <Pressable style={styles.cartButton} onPress={() => router.push("/(restaurant)/cart")}>
            <Ionicons name="cart-outline" size={18} color={colors.textStrong} />
            {cartCount > 0 ? <Text style={styles.cartCount}>{cartCount}</Text> : null}
          </Pressable>
        </View>

        <View style={styles.addressRow}>
          <Text style={styles.address}>{roleSession.organizationName ?? "Tu restaurante"}</Text>
          <Text style={styles.addressSub}>{roleSession.city ?? "Sevilla"} · Operativa en curso</Text>
        </View>

        <View style={styles.categoryBubbleGrid}>
          {categories.map((category) => {
            const visual = categoryVisuals[category.code];
            return (
              <Pressable
                key={category.code}
                style={styles.categoryBubble}
                onPress={() => router.push(`/(restaurant)/providers/${category.code}`)}
              >
                <View style={[styles.categoryIconWrap, { backgroundColor: `${visual.accentColor}22` }]}>
                  <Text style={styles.categoryIcon}>{visual.icon}</Text>
                </View>
                <Text style={styles.categoryLabel}>{category.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActions}>
        <Pressable style={styles.quickChip} onPress={() => router.push("/(restaurant)/contracts")}>
          <Ionicons name="document-text-outline" size={14} color={colors.textStrong} />
          <Text style={styles.quickChipText}>Contratos</Text>
        </Pressable>
        <Pressable style={styles.quickChip} onPress={() => router.push("/(restaurant)/recurring/new")}>
          <Ionicons name="repeat-outline" size={14} color={colors.textStrong} />
          <Text style={styles.quickChipText}>Pedidos automáticos</Text>
        </Pressable>
        <Pressable style={styles.quickChip} onPress={signOut}>
          <Ionicons name="log-out-outline" size={14} color={colors.textStrong} />
          <Text style={styles.quickChipText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Proveedores destacados</Text>
        <Text style={styles.sectionSubtitle}>Con contrato activo y entrega en zonas céntricas</Text>
      </View>

      {hasError ? <EmptyState light title="No se pudo cargar la oferta" subtitle="Reintenta en unos segundos." /> : null}
      {isLoading ? <Text style={styles.message}>Cargando proveedores...</Text> : null}

      {featuredProviders.map((provider) => {
        const loweredName = provider.name.toLowerCase();
        const fallbackCategory = loweredName.includes("pesc")
          ? "seafood"
          : loweredName.includes("frut") || loweredName.includes("mercado de feria")
            ? "produce"
            : "meat";

        const etaText =
          provider.etaMin && provider.etaMax
            ? `${provider.etaMin}-${provider.etaMax} min`
            : `${(22 + provider.distanceKm * 8).toFixed(0)}-${(30 + provider.distanceKm * 9).toFixed(0)} min`;

        return (
          <Pressable key={provider.id} style={styles.providerCard} onPress={() => router.push(`/(restaurant)/provider/${provider.id}`)}>
            <Image source={{ uri: provider.cardImage ?? producerCardImage(provider.id, fallbackCategory) }} style={styles.providerImage} />
            <View style={styles.providerBody}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.providerMeta}>{`${provider.city} · ${etaText}`}</Text>
              <Text style={styles.providerTagline} numberOfLines={1}>
                {provider.tagline ?? "Entrega profesional para hostelería"}
              </Text>
              <View style={styles.providerFooter}>
                <View style={styles.badge}>
                  <Ionicons name="star" size={12} color="#f8a500" />
                  <Text style={styles.badgeText}>{provider.rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.fee}>{`Envío ${provider.deliveryFeeEur.toFixed(2)}€`}</Text>
              </View>
            </View>
          </Pressable>
        );
      })}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.md
  },
  topHero: {
    borderRadius: radius.xl,
    backgroundColor: colors.brandYellow,
    padding: 14,
    gap: 14,
    marginBottom: 8
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center"
  },
  searchBar: {
    flex: 1,
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.75)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12
  },
  searchText: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  cartButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center"
  },
  cartCount: {
    position: "absolute",
    right: -2,
    top: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.brand,
    textAlign: "center",
    textAlignVertical: "center",
    color: colors.textDark,
    fontSize: 11,
    overflow: "hidden",
    fontFamily: fonts.bodyStrong
  },
  addressRow: {
    gap: 2
  },
  address: {
    color: colors.textStrong,
    fontSize: 26,
    lineHeight: 31,
    fontFamily: fonts.heading
  },
  addressSub: {
    color: "#3a4350",
    fontSize: 13,
    fontFamily: fonts.body
  },
  categoryBubbleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12
  },
  categoryBubble: {
    width: "31%",
    alignItems: "center",
    gap: 6
  },
  categoryIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.88)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(22,26,33,0.09)"
  },
  categoryIcon: {
    fontSize: 30
  },
  categoryLabel: {
    color: colors.textStrong,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 15,
    fontFamily: fonts.bodyStrong
  },
  quickActions: {
    gap: 8,
    paddingBottom: 6,
    paddingTop: 2
  },
  quickChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    paddingHorizontal: 12,
    minHeight: 38
  },
  quickChipText: {
    color: colors.textStrong,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 2
  },
  sectionTitle: {
    color: colors.textStrong,
    fontSize: 25,
    lineHeight: 30,
    fontFamily: fonts.heading
  },
  sectionSubtitle: {
    color: colors.textSoftDark,
    fontSize: 13,
    marginTop: 3,
    fontFamily: fonts.body
  },
  message: {
    color: colors.textSoftDark,
    fontSize: 14,
    marginTop: 8,
    fontFamily: fonts.body
  },
  providerCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    overflow: "hidden",
    backgroundColor: colors.lightSurface,
    marginTop: 10
  },
  providerImage: {
    width: "100%",
    height: 138,
    backgroundColor: "#d8d8d8"
  },
  providerBody: {
    padding: 12,
    gap: 4
  },
  providerName: {
    color: colors.textStrong,
    fontSize: 22,
    lineHeight: 27,
    fontFamily: fonts.heading
  },
  providerMeta: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  },
  providerTagline: {
    color: "#4f5b68",
    fontSize: 12,
    fontFamily: fonts.body
  },
  providerFooter: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: "#fff8e8",
    paddingHorizontal: 9,
    paddingVertical: 4
  },
  badgeText: {
    color: colors.textStrong,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  fee: {
    color: colors.textStrong,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  }
});
