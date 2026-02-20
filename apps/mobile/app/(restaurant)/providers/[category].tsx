import { useLocalSearchParams, router } from "expo-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { EmptyState } from "../../../components/EmptyState";
import { fetchProducersByCategory } from "../../../lib/api";
import { producerCardImage } from "../../../lib/showcase";
import { colors, fonts, radius, spacing } from "../../../lib/theme";

type CategoryCode = "meat" | "seafood" | "produce";

const categoryLabel: Record<CategoryCode, string> = {
  meat: "Carnes",
  seafood: "Mariscos",
  produce: "Frutas y verduras"
};

const categoryChips: Record<CategoryCode, string[]> = {
  meat: ["Filtros", "Vacuno", "Ibérico", "Aves"],
  seafood: ["Filtros", "Fresco", "Congelado", "Marisco"],
  produce: ["Filtros", "Temporada", "Bio", "Listo para cocina"]
};

export default function ProvidersByCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: CategoryCode }>();
  const categoryCode: CategoryCode = category ?? "meat";

  const { data, isLoading, error } = useQuery({
    queryKey: ["providers", categoryCode],
    queryFn: () => fetchProducersByCategory(categoryCode)
  });

  const subtitle = useMemo(() => {
    if (!data?.length) return "Sin proveedores disponibles";
    return `${data.length} opciones operando hoy en Sevilla`;
  }, [data]);

  return (
    <AppScreen scroll={false} dark={false} backgroundColor={colors.bgLight} style={styles.root}>
      {error ? <EmptyState light title="No pudimos cargar proveedores" subtitle="Intenta nuevamente en unos segundos." /> : null}

      {!error ? (
        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.headerWrap}>
              <View style={styles.navRow}>
                <Pressable onPress={() => router.back()} style={styles.iconButton}>
                  <Ionicons name="chevron-back" size={20} color={colors.textStrong} />
                </Pressable>
                <Text style={styles.title}>{categoryLabel[categoryCode]}</Text>
                <Pressable style={styles.iconButton} onPress={() => router.push("/(restaurant)/cart")}>
                  <Ionicons name="cart-outline" size={18} color={colors.textStrong} />
                </Pressable>
              </View>

              <Text style={styles.subtitle}>{subtitle}</Text>

              <Pressable style={styles.searchBar} onPress={() => router.push(`/(restaurant)/providers/${categoryCode}`)}>
                <Ionicons name="search-outline" size={18} color={colors.textSoftDark} />
                <Text style={styles.searchText}>Buscar establecimiento o producto</Text>
              </Pressable>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
                {categoryChips[categoryCode].map((item, index) => (
                  <View key={item} style={[styles.chip, index === 0 && styles.chipPrimary]}>
                    <Text style={[styles.chipText, index === 0 && styles.chipTextPrimary]}>{item}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          }
          ListEmptyComponent={
            isLoading ? <Text style={styles.loading}>Cargando proveedores...</Text> : <EmptyState light title="No hay proveedores en esta categoría" />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => router.push(`/(restaurant)/provider/${item.id}`)}>
              <Image source={{ uri: item.cardImage ?? producerCardImage(item.id, categoryCode) }} style={styles.cardImage} />

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardSub}>{`${item.etaMin ?? (20 + item.distanceKm * 8).toFixed(0)}-${item.etaMax ?? (28 + item.distanceKm * 8).toFixed(0)} min · ${item.city}`}</Text>
                <Text style={styles.cardTagline} numberOfLines={1}>
                  {item.tagline ?? "Suministro profesional para hostelería"}
                </Text>

                <View style={styles.cardFooter}>
                  <View style={styles.metricPill}>
                    <Ionicons name="star" size={12} color="#f8a500" />
                    <Text style={styles.metricPillText}>{`${item.rating.toFixed(1)} (${Math.max(16, Math.round(item.rating * 9))})`}</Text>
                  </View>
                  <Text style={styles.deliveryFee}>{`Envío ${item.deliveryFeeEur.toFixed(2)}€`}</Text>
                </View>
              </View>
            </Pressable>
          )}
        />
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.md
  },
  headerWrap: {
    marginBottom: spacing.md,
    gap: 10
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
  title: {
    color: colors.textStrong,
    fontSize: 28,
    lineHeight: 33,
    fontFamily: fonts.heading
  },
  subtitle: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
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
  chipsContainer: {
    gap: 8,
    paddingVertical: 2
  },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    paddingHorizontal: 12,
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center"
  },
  chipPrimary: {
    backgroundColor: "#fbf3d7",
    borderColor: "#f3df98"
  },
  chipText: {
    color: colors.textStrong,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  },
  chipTextPrimary: {
    color: "#80610b"
  },
  listContent: {
    gap: 12,
    paddingBottom: 26
  },
  loading: {
    color: colors.textSoftDark,
    textAlign: "center",
    marginTop: 20,
    fontFamily: fonts.body
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    overflow: "hidden"
  },
  cardImage: {
    height: 150,
    width: "100%",
    backgroundColor: "#d8d8d8"
  },
  cardBody: {
    padding: 12,
    gap: 4
  },
  cardTitle: {
    color: colors.textStrong,
    fontSize: 24,
    lineHeight: 30,
    fontFamily: fonts.heading
  },
  cardSub: {
    color: colors.textSoftDark,
    fontSize: 13,
    fontFamily: fonts.body
  },
  cardTagline: {
    color: "#4f5b68",
    fontSize: 12,
    fontFamily: fonts.body
  },
  cardFooter: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  metricPill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: "#fff8e8",
    paddingHorizontal: 9,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  },
  metricPillText: {
    color: colors.textStrong,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  deliveryFee: {
    color: colors.textStrong,
    fontSize: 13,
    fontFamily: fonts.bodyStrong
  }
});
