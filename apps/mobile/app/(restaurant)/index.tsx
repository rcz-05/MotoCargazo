import { router } from "expo-router";
import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../components/AppScreen";
import { EmptyState } from "../../components/EmptyState";
import { AppImage } from "../../components/AppImage";
import { FloatingCartCTA } from "../../components/FloatingCartCTA";
import { MetaStatPill } from "../../components/MetaStatPill";
import { SectionHeader } from "../../components/SectionHeader";
import { fetchProducersByCategory } from "../../lib/api";
import { getDemoProducerCardsByCategory } from "../../lib/demoCatalog";
import { warmProviderRoute } from "../../lib/restaurantPrefetch";
import { categoryVisuals, producerCardImage } from "../../lib/showcase";
import { useSession } from "../../lib/session";
import { colors, elevation, fonts, radius, spacing } from "../../lib/theme";
import { useCartStore } from "../../store/cart-store";
import { motionStagger, useEntranceAnimation, useReducedMotionPreference } from "../../lib/motion";
import { DemoCategoryCode } from "../../lib/demoMedia";

const categories = [
  { code: "meat", label: "Carnes" },
  { code: "seafood", label: "Mariscos" },
  { code: "produce", label: "Frutas y verduras" }
] as const;

function formatRestaurantHeroTitle(name: string | null | undefined) {
  const normalizedName = name?.trim();
  if (!normalizedName) return "Tu Restaurante";
  if (normalizedName.toLowerCase() === "restaurante demo sevilla") {
    return "Restaurante\nDemo\nSevilla";
  }
  return normalizedName;
}

export default function RestaurantHomeScreen() {
  const { roleSession } = useSession();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.length;
  const cartSubtotal = useCartStore((state) => state.getSubtotal());
  const [searchQuery, setSearchQuery] = useState("");
  const reducedMotion = useReducedMotionPreference();
  const heroMotion = useEntranceAnimation({ delay: motionStagger.screenEnter, reducedMotion });
  const sectionMotion = useEntranceAnimation({ delay: motionStagger.screenEnter * 2, reducedMotion });
  const heroTitle = useMemo(() => formatRestaurantHeroTitle(roleSession.organizationName), [roleSession.organizationName]);

  const categoryQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: ["home-providers", category.code],
      queryFn: () => fetchProducersByCategory(category.code),
      initialData: getDemoProducerCardsByCategory(category.code)
    }))
  });

  const featuredProviders = useMemo(() => {
    const grouped = categoryQueries.flatMap((query) => query.data ?? []);
    const unique = new Map(grouped.map((producer) => [producer.id, producer]));
    const filtered = [...unique.values()].filter((provider) => {
      const haystack = `${provider.name} ${provider.city} ${provider.tagline ?? ""}`.toLowerCase();
      return haystack.includes(searchQuery.trim().toLowerCase());
    });
    return filtered;
  }, [categoryQueries, searchQuery]);

  const readyToday = featuredProviders.slice(0, 8);
  const topMarkets = [...featuredProviders].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const quickReorder = topMarkets.slice(0, 3);

  const hasError = categoryQueries.some((query) => query.error);
  const isLoading = categoryQueries.every((query) => query.isLoading);

  return (
    <AppScreen dark={false} backgroundColor={colors.bgLight} style={styles.root} contentContainerStyle={styles.content}>
      <Animated.View style={[styles.topHero, heroMotion]}>
        <View style={styles.topHeader}>
          <View style={styles.addressWrap}>
            <Text style={styles.address}>{heroTitle}</Text>
            <View style={styles.demoBadge}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={15} color={colors.brandDark} />
              <Text style={styles.demoBadgeText}>Restaurante demo</Text>
            </View>
            <Text style={styles.addressSub}>{roleSession.city ?? "Sevilla"} · demo pública</Text>
          </View>
        </View>

        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={18} color={colors.textSoftDark} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="¿Qué necesitas hoy?"
            placeholderTextColor={colors.textSoftDark}
            style={styles.searchInput}
            returnKeyType="search"
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <MaterialCommunityIcons name="close-circle-outline" size={18} color={colors.textSoftDark} />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.categoryBubbleGrid}>
          {categories.map((category) => {
            const visual = categoryVisuals[category.code as DemoCategoryCode];
            const iconDescriptor = visual.icon;
            return (
              <Pressable
                key={category.code}
                style={styles.categoryBubble}
                onPress={() => router.push(`/(restaurant)/providers/${category.code}`)}
              >
                <View style={[styles.categoryIconWrap, { borderColor: `${visual.accentColor}4A` }]}>
                  <MaterialCommunityIcons name={iconDescriptor.name} size={30} color={visual.accentColor} />
                </View>
                <Text style={styles.categoryLabel} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
                  {category.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Animated.View style={[styles.demoStrip, sectionMotion]}>
          <View style={styles.demoStripHeader}>
            <MaterialCommunityIcons name="play-circle-outline" size={16} color={colors.brandDark} />
            <Text style={styles.demoStripTitle}>Recorrido demo</Text>
          </View>
          <Text style={styles.demoStripText}>Explora mercados, añade producto y simula checkout completo sin login.</Text>
        </Animated.View>
      </Animated.View>

      <SectionHeader
        title="Listo para hoy"
        subtitle="Operativa inmediata para cocina de servicio"
        actionLabel="Ver más"
        onActionPress={() => router.push("/(restaurant)/providers/produce")}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCards}>
        {readyToday.map((provider) => {
          const fallbackCategory = provider.name.toLowerCase().includes("pesc")
            ? "seafood"
            : provider.name.toLowerCase().includes("frut") || provider.name.toLowerCase().includes("feria")
              ? "produce"
              : "meat";

          return (
              <Pressable
                key={provider.id}
                style={styles.todayCard}
                onPressIn={() => warmProviderRoute(provider.id)}
                onPress={() => router.push(`/(restaurant)/provider/${provider.id}`)}
              >
                <AppImage
                  source={provider.cardImageSource ?? provider.cardImage}
                  fallbackSource={
                    provider.cardImageSource ? undefined : [producerCardImage(provider.id, fallbackCategory), categoryVisuals[fallbackCategory].coverImage]
                  }
                  style={styles.todayImage}
                />
              <View style={styles.todayBody}>
                <Text style={styles.todayName} numberOfLines={1}>
                  {provider.name}
                </Text>
                <Text style={styles.todayMeta} numberOfLines={1}>
                  {`${provider.etaMin ?? 20}-${provider.etaMax ?? 32} min`}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <SectionHeader title="Mercados top de Sevilla" subtitle="Curado para reposición diaria sin fricción" />

      {hasError ? <EmptyState light title="No se pudo cargar la oferta" subtitle="Reintenta en unos segundos." /> : null}
      {isLoading ? <Text style={styles.message}>Cargando proveedores...</Text> : null}

      {topMarkets.map((provider) => {
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
          <Pressable
            key={provider.id}
            style={styles.providerCard}
            onPressIn={() => warmProviderRoute(provider.id)}
            onPress={() => router.push(`/(restaurant)/provider/${provider.id}`)}
          >
            <AppImage
              source={provider.cardImageSource ?? provider.cardImage}
              fallbackSource={
                provider.cardImageSource ? undefined : [producerCardImage(provider.id, fallbackCategory), categoryVisuals[fallbackCategory].coverImage]
              }
              style={styles.providerImage}
              borderRadius={0}
            />
            <View style={styles.providerBody}>
              <Text style={styles.providerName}>{provider.name}</Text>
              <Text style={styles.providerTagline} numberOfLines={1}>
                {provider.tagline ?? "Entrega profesional para hostelería"}
              </Text>
              <View style={styles.providerStats}>
                <MetaStatPill icon="thumbs-up-outline" label={`${Math.round(provider.rating * 20)}%`} emphasis="success" />
                <MetaStatPill icon="time-outline" label={etaText} />
                <MetaStatPill icon="bicycle-outline" label={`${provider.deliveryFeeEur.toFixed(2)}€`} />
              </View>
            </View>
          </Pressable>
        );
      })}

      <SectionHeader title="Recompra rápida" subtitle="Vuelve a tus mercados frecuentes en un toque" />
      <View style={styles.reorderRow}>
        {quickReorder.map((provider) => (
          <Pressable key={provider.id} style={styles.reorderChip} onPress={() => router.push(`/(restaurant)/provider/${provider.id}`)}>
            <MaterialCommunityIcons name="refresh" size={14} color={colors.brandDark} />
            <Text style={styles.reorderChipText} numberOfLines={1}>
              {provider.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {cartCount > 0 ? (
        <FloatingCartCTA
          count={cartCount}
          totalLabel={`${cartSubtotal.toFixed(2)}€`}
          title={`Pedir ${cartCount} producto${cartCount > 1 ? "s" : ""}`}
          onPress={() => router.push("/(restaurant)/cart")}
        />
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.md
  },
  content: {
    gap: 12,
    paddingBottom: 120
  },
  topHero: {
    borderRadius: radius.xl,
    backgroundColor: colors.brandYellow,
    padding: 16,
    gap: 12,
    marginBottom: 2,
    ...elevation.level2
  },
  topHeader: {
    gap: 10
  },
  addressWrap: {
    gap: 10
  },
  address: {
    color: colors.textStrong,
    fontSize: 32,
    lineHeight: 36,
    fontFamily: fonts.heading
  },
  addressSub: {
    color: "#3a4350",
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  },
  demoBadge: {
    alignSelf: "flex-start",
    minHeight: 36,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.86)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(14,18,24,0.1)",
    flexDirection: "row",
    gap: 6
  },
  demoBadgeText: {
    color: colors.textStrong,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  searchBar: {
    minHeight: 46,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.88)",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(14,18,24,0.1)"
  },
  searchInput: {
    flex: 1,
    color: colors.textStrong,
    fontSize: 14,
    fontFamily: fonts.bodyStrong,
    paddingVertical: 0
  },
  categoryBubbleGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  categoryBubble: {
    flex: 1,
    alignItems: "center",
    gap: 7
  },
  categoryIconWrap: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(22,26,33,0.18)"
  },
  categoryLabel: {
    color: colors.textStrong,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 16,
    fontFamily: fonts.bodyBold
  },
  demoStrip: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(29,35,42,0.16)",
    backgroundColor: "rgba(255,252,245,0.72)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6
  },
  demoStripHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  demoStripTitle: {
    color: colors.textStrong,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  },
  demoStripText: {
    color: colors.textSoftDark,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body
  },
  horizontalCards: {
    gap: 10,
    paddingRight: 6
  },
  todayCard: {
    width: 160,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    overflow: "hidden",
    ...elevation.level1
  },
  todayImage: {
    width: "100%",
    height: 92
  },
  todayBody: {
    padding: 10,
    gap: 2
  },
  todayName: {
    color: colors.textStrong,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  todayMeta: {
    color: colors.textSoftDark,
    fontSize: 12,
    fontFamily: fonts.body
  },
  providerCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    overflow: "hidden",
    ...elevation.level1
  },
  providerImage: {
    height: 184,
    width: "100%"
  },
  providerBody: {
    padding: 12,
    gap: 8
  },
  providerName: {
    color: colors.textStrong,
    fontSize: 26,
    lineHeight: 31,
    fontFamily: fonts.heading
  },
  providerTagline: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  },
  providerStats: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap"
  },
  reorderRow: {
    gap: 8
  },
  reorderChip: {
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    ...elevation.level1
  },
  reorderChipText: {
    flex: 1,
    color: colors.textStrong,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  },
  message: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  }
});
