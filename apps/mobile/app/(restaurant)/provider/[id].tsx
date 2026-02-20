import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { ProductRow } from "../../../components/ProductRow";
import { EmptyState } from "../../../components/EmptyState";
import { fetchProducerById } from "../../../lib/api";
import { producerHeroImage } from "../../../lib/showcase";
import { useCartStore } from "../../../store/cart-store";
import { colors, fonts, radius, spacing } from "../../../lib/theme";

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

  const { data, isLoading, error } = useQuery({
    queryKey: ["producer", id],
    enabled: Boolean(id),
    queryFn: () => fetchProducerById(id)
  });

  const categories = useMemo(() => {
    if (!data?.products?.length) return [] as string[];
    return [...new Set(data.products.map((product) => product.category_code))];
  }, [data?.products]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const selectedCategory = activeCategory ?? categories[0] ?? null;
  const visibleProducts = useMemo(() => {
    if (!data?.products?.length || !selectedCategory) return [];
    return data.products.filter((product) => product.category_code === selectedCategory);
  }, [data?.products, selectedCategory]);

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
          <View style={styles.headerWrap}>
            <View style={styles.navRow}>
              <Pressable onPress={() => router.back()} style={styles.iconButton}>
                <Ionicons name="chevron-back" size={20} color={colors.textStrong} />
              </Pressable>
              <Text style={styles.navTitle} numberOfLines={1}>
                {data.name}
              </Text>
              <Pressable style={styles.iconButton} onPress={() => router.push("/(restaurant)/cart")}>
                <Ionicons name="cart-outline" size={18} color={colors.textStrong} />
              </Pressable>
            </View>

            <View style={styles.heroCard}>
              <Image source={{ uri: data.heroImage ?? producerHeroImage(data.id) }} style={styles.heroImage} />
              <View style={styles.heroOverlay} />

              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>{data.name}</Text>
                <Text style={styles.heroSubtitle}>
                  {data.tagline ?? `Suministro profesional para hostelería en ${data.city}`}
                </Text>

                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Ionicons name="thumbs-up-outline" size={14} color="#0ea35b" />
                    <Text style={styles.metricText}>{`${(data.rating * 20).toFixed(0)}%`}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textStrong} />
                    <Text style={styles.metricText}>{`${data.etaMin ?? 22}-${data.etaMax ?? 35} min`}</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Ionicons name="bicycle-outline" size={14} color={colors.textStrong} />
                    <Text style={styles.metricText}>{`${data.deliveryFeeEur.toFixed(2)}€`}</Text>
                  </View>
                </View>
              </View>
            </View>

            <Pressable style={styles.searchBar}>
              <Ionicons name="search-outline" size={18} color={colors.textSoftDark} />
              <Text style={styles.searchText}>¿Qué necesitas?</Text>
            </Pressable>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <Pressable
                    key={category}
                    style={[styles.tab, isActive && styles.tabActive]}
                    onPress={() => setActiveCategory(category)}
                  >
                    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{categoryLabel[category] ?? category}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={styles.sectionTitle}>Lo más vendido</Text>
          </View>
        }
        ListEmptyComponent={<EmptyState light title="No hay productos en esta categoría" />}
        renderItem={({ item }) => (
          <ProductRow
            name={item.name}
            subtitle={`${item.description ?? "Producto fresco"} · ${item.unit}`}
            price={Number(item.base_price_eur)}
            imageUrl={item.image_url}
            onPress={() => router.push(`/(restaurant)/product/${item.id}`)}
            onAdd={() =>
              addItem(
                {
                  productId: item.id,
                  producerId: item.producer_id,
                  name: item.name,
                  unit: item.unit,
                  unitPriceEur: Number(item.base_price_eur),
                  imageUrl: item.image_url
                },
                1
              )
            }
          />
        )}
        ListFooterComponent={<View style={{ height: items.length > 0 ? 96 : 24 }} />}
      />

      {items.length > 0 ? (
        <View style={styles.stickyActionWrap}>
          <Pressable style={styles.stickyAction} onPress={() => router.push("/(restaurant)/cart")}>
            <Text style={styles.stickyActionText}>{`Pedir ${items.length} producto${items.length > 1 ? "s" : ""} por ${subtotal.toFixed(2)}€`}</Text>
          </Pressable>
        </View>
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
    justifyContent: "center"
  },
  navTitle: {
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
    color: colors.textStrong,
    fontSize: 23,
    lineHeight: 28,
    fontFamily: fonts.heading
  },
  heroCard: {
    borderRadius: radius.xl,
    overflow: "hidden",
    minHeight: 230,
    position: "relative"
  },
  heroImage: {
    width: "100%",
    height: 230,
    backgroundColor: "#d8d8d8"
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(14,19,24,0.3)"
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
    fontSize: 36,
    lineHeight: 40,
    fontFamily: fonts.heading
  },
  heroSubtitle: {
    color: "#ecf2f4",
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.body
  },
  metricsRow: {
    marginTop: 3,
    flexDirection: "row",
    gap: 8
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    minHeight: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.45)",
    backgroundColor: "rgba(248,251,255,0.88)"
  },
  metricText: {
    color: colors.textStrong,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  searchBar: {
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12
  },
  searchText: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.body
  },
  tabsRow: {
    gap: 8,
    paddingVertical: 2
  },
  tab: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    paddingHorizontal: 14,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center"
  },
  tabActive: {
    borderColor: "#f2ce5f",
    backgroundColor: "#fff7db"
  },
  tabText: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  },
  tabTextActive: {
    color: colors.textStrong
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
  },
  stickyActionWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14
  },
  stickyAction: {
    minHeight: 52,
    borderRadius: radius.pill,
    backgroundColor: "#00b48d",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#009f7d",
    shadowColor: "#0d3029",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2
  },
  stickyActionText: {
    color: colors.white,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: fonts.bodyStrong
  }
});
