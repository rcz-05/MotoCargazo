import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Animated, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { ProductRow } from "../../../components/ProductRow";
import { EmptyState } from "../../../components/EmptyState";
import { AppImage } from "../../../components/AppImage";
import { FilterChip } from "../../../components/FilterChip";
import { FloatingCartCTA } from "../../../components/FloatingCartCTA";
import { MetaStatPill } from "../../../components/MetaStatPill";
import { StickySearchHeader } from "../../../components/StickySearchHeader";
import { fetchProducerById } from "../../../lib/api";
import { getDemoProviderById } from "../../../lib/demoCatalog";
import { preloadImageSources } from "../../../lib/imageSources";
import { warmProductRoute } from "../../../lib/restaurantPrefetch";
import { categoryVisuals, producerHeroImage } from "../../../lib/showcase";
import { useCartStore } from "../../../store/cart-store";
import { colors, elevation, fonts, radius, spacing } from "../../../lib/theme";
import { motionStagger, runLayoutTransition, useEntranceAnimation, useReducedMotionPreference } from "../../../lib/motion";

const categoryLabel: Record<string, string> = {
  meat: "Carnes",
  seafood: "Pescados y mariscos",
  produce: "Frutas y verduras"
};

export default function ProducerCatalogScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const reducedMotion = useReducedMotionPreference();
  const heroMotion = useEntranceAnimation({ delay: motionStagger.screenEnter, reducedMotion });

  const { data, isLoading, error } = useQuery({
    queryKey: ["producer", id],
    enabled: Boolean(id),
    initialData: id ? getDemoProviderById(id) ?? undefined : undefined,
    queryFn: () => fetchProducerById(id)
  });

  const categories = useMemo(() => {
    if (!data?.products?.length) return [] as string[];
    return [...new Set(data.products.map((product) => product.category_code))];
  }, [data?.products]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<"top" | "priceAsc" | "priceDesc">("top");

  const selectedCategory = activeCategory ?? categories[0] ?? null;
  const fallbackCategory = (selectedCategory ?? categories[0] ?? "produce") as "meat" | "seafood" | "produce";
  const visibleProducts = useMemo(() => {
    if (!data?.products?.length || !selectedCategory) return [];
    const query = searchQuery.trim().toLowerCase();

    const filtered = data.products.filter((product) => {
      if (product.category_code !== selectedCategory) return false;
      if (!query) return true;
      const haystack = `${product.name} ${product.description ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });

    if (sortMode === "priceAsc") {
      return [...filtered].sort((a, b) => Number(a.base_price_eur) - Number(b.base_price_eur));
    }

    if (sortMode === "priceDesc") {
      return [...filtered].sort((a, b) => Number(b.base_price_eur) - Number(a.base_price_eur));
    }

    return [...filtered].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
  }, [data?.products, selectedCategory, searchQuery, sortMode]);

  useEffect(() => {
    if (!data) return;
    void preloadImageSources([
      data.heroImageSource ?? data.heroImage,
      ...visibleProducts.slice(0, 6).flatMap((product) => [product.image_source ?? product.image_url, product.image_fallback_source])
    ]);
  }, [data, visibleProducts]);

  if (isLoading) {
    return (
      <AppScreen dark={false} backgroundColor={colors.bgLight}>
        <Text style={styles.loading}>Cargando catálogo...</Text>
      </AppScreen>
    );
  }

  if (error || !data) {
    return (
      <AppScreen dark={false} backgroundColor={colors.bgLight}>
        <EmptyState light title="No se pudo cargar el catálogo" subtitle="Reintenta en unos segundos." />
      </AppScreen>
    );
  }

  return (
    <AppScreen scroll={false} dark={false} backgroundColor={colors.bgLight} style={styles.root}>
      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <Animated.View style={[styles.headerWrap, heroMotion]}>
            <View style={styles.navRow}>
              <Pressable onPress={() => router.back()} style={styles.iconButton}>
                <MaterialCommunityIcons name="chevron-left" size={20} color={colors.textStrong} />
              </Pressable>
              <Text style={styles.navTitle} numberOfLines={1}>
                {data.name}
              </Text>
              <Pressable style={styles.iconButton} onPress={() => router.push("/(restaurant)/cart")}>
                <MaterialCommunityIcons name="cart-outline" size={18} color={colors.textStrong} />
              </Pressable>
            </View>

            <View style={styles.heroCard}>
              <AppImage
                source={data.heroImageSource ?? data.heroImage}
                fallbackSource={
                  data.heroImageSource ? undefined : [producerHeroImage(data.id, fallbackCategory), categoryVisuals[fallbackCategory].coverImage]
                }
                style={styles.heroImage}
                borderRadius={0}
              />
              <View style={styles.heroOverlay} />

              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{data.name}</Text>
              <Text style={styles.heroSubtitle}>
                {data.tagline ?? `Suministro profesional para hostelería en ${data.city}`}
              </Text>

                <View style={styles.metricsRow}>
                  <MetaStatPill icon="thumbs-up-outline" label={`${(data.rating * 20).toFixed(0)}%`} emphasis="success" />
                  <MetaStatPill icon="time-outline" label={`${data.etaMin ?? 22}-${data.etaMax ?? 35} min`} />
                  <MetaStatPill icon="bicycle-outline" label={`${data.deliveryFeeEur.toFixed(2)}€`} />
                </View>
              </View>
            </View>

            <StickySearchHeader
              query={searchQuery}
              onChangeQuery={setSearchQuery}
              placeholder="Buscar producto dentro del catálogo"
            />

            <View style={styles.promoStrip}>
              <MaterialCommunityIcons name="star-four-points" size={16} color="#5E420D" />
              <Text style={styles.promoText}>Entrega prioritaria disponible en franja 06:00 - 08:00</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <FilterChip
                    key={category}
                    label={categoryLabel[category] ?? category}
                    selected={isActive}
                    onPress={() => {
                      runLayoutTransition(reducedMotion);
                      setActiveCategory(category);
                    }}
                  />
                );
              })}
            </ScrollView>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
              <FilterChip
                label="Top ventas"
                selected={sortMode === "top"}
                onPress={() => {
                  runLayoutTransition(reducedMotion);
                  setSortMode("top");
                }}
              />
              <FilterChip
                label="Precio ↑"
                selected={sortMode === "priceAsc"}
                onPress={() => {
                  runLayoutTransition(reducedMotion);
                  setSortMode("priceAsc");
                }}
              />
              <FilterChip
                label="Precio ↓"
                selected={sortMode === "priceDesc"}
                onPress={() => {
                  runLayoutTransition(reducedMotion);
                  setSortMode("priceDesc");
                }}
              />
            </ScrollView>

            <Text style={styles.sectionTitle}>Catálogo</Text>
          </Animated.View>
        }
        ListEmptyComponent={<EmptyState light title="No hay productos en esta categoría" />}
        renderItem={({ item }) => (
          <ProductRow
            name={item.name}
            subtitle={`${item.description ?? "Producto fresco"} · ${item.unit}`}
            price={Number(item.base_price_eur)}
            imageSource={item.image_source ?? item.image_url}
            fallbackSource={item.image_source ? item.image_fallback_source : undefined}
            category={item.category_code}
            badge={item.badge}
            onPressIn={() => warmProductRoute(item.id)}
            onPress={() => router.push(`/(restaurant)/product/${item.id}`)}
            onAdd={() =>
              addItem(
                {
                  productId: item.id,
                  producerId: item.producer_id,
                  category: item.category_code,
                  name: item.name,
                  unit: item.unit,
                  unitPriceEur: Number(item.base_price_eur),
                  imageUrl: item.image_url,
                  imageSource: item.image_source
                },
                1
              )
            }
          />
        )}
        ListFooterComponent={<View style={{ height: items.length > 0 ? 132 : 26 }} />}
      />

      {items.length > 0 ? (
        <FloatingCartCTA
          count={items.length}
          totalLabel={`${subtotal.toFixed(2)}€`}
          title={`Pedir ${items.length} producto${items.length > 1 ? "s" : ""}`}
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
  listContent: {
    gap: 10,
    paddingBottom: 16
  },
  headerWrap: {
    gap: 10,
    marginBottom: 2
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
    justifyContent: "center",
    ...elevation.level1
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
    color: colors.textStrong,
    fontSize: 22,
    lineHeight: 27,
    fontFamily: fonts.heading
  },
  heroCard: {
    borderRadius: radius.xl,
    overflow: "hidden",
    minHeight: 230,
    position: "relative",
    ...elevation.level2
  },
  heroImage: {
    width: "100%",
    height: 230,
    backgroundColor: "#d8d8d8"
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14,19,24,0.44)"
  },
  heroContent: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    gap: 6
  },
  heroTitle: {
    color: colors.white,
    fontSize: 33,
    lineHeight: 37,
    fontFamily: fonts.heading
  },
  heroSubtitle: {
    color: "#ecf2f4",
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.bodyStrong
  },
  metricsRow: {
    marginTop: 3,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap"
  },
  promoStrip: {
    minHeight: 40,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: "#C39B4A",
    backgroundColor: "#FFF2CC",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7
  },
  promoText: {
    flex: 1,
    color: "#5E420D",
    fontSize: 13,
    fontFamily: fonts.bodyBold
  },
  tabsRow: {
    gap: 8,
    paddingVertical: 2
  },
  sectionTitle: {
    marginTop: 2,
    color: colors.textStrong,
    fontSize: 31,
    lineHeight: 36,
    fontFamily: fonts.heading
  },
  loading: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.body
  }
});
