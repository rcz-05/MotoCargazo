import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { EmptyState } from "../../../components/EmptyState";
import { AppImage } from "../../../components/AppImage";
import { MetaStatPill } from "../../../components/MetaStatPill";
import { SectionHeader } from "../../../components/SectionHeader";
import { StickySearchHeader } from "../../../components/StickySearchHeader";
import { fetchProducersByCategory } from "../../../lib/api";
import { getDemoProducerCardsByCategory } from "../../../lib/demoCatalog";
import { warmProviderRoute } from "../../../lib/restaurantPrefetch";
import { categoryVisuals, producerCardImage } from "../../../lib/showcase";
import { colors, elevation, fonts, radius, spacing } from "../../../lib/theme";
import { runLayoutTransition, useReducedMotionPreference } from "../../../lib/motion";

type CategoryCode = "meat" | "seafood" | "produce";

const categoryLabel: Record<CategoryCode, string> = {
  meat: "Carnes",
  seafood: "Mariscos",
  produce: "Frutas y verduras"
};

const categoryChips: Record<CategoryCode, string[]> = {
  meat: ["Todos", "Vacuno", "Ibérico", "Aves"],
  seafood: ["Todos", "Fresco", "Congelado", "Marisco"],
  produce: ["Todos", "Temporada", "Bio", "Listo cocina"]
};

function matchesFilterChip(category: CategoryCode, chip: string, text: string) {
  if (chip === "Todos") return true;

  switch (category) {
    case "meat":
      if (chip === "Vacuno") return /vacuno|ternera|buey|res/i.test(text);
      if (chip === "Ibérico") return /ib[eé]rico|jam[oó]n|charcut/i.test(text);
      if (chip === "Aves") return /pollo|poller[ií]a|ave/i.test(text);
      return true;
    case "seafood":
      if (chip === "Fresco") return /fresco|lonja|diaria/i.test(text);
      if (chip === "Congelado") return /congelado/i.test(text) || /soruco/i.test(text);
      if (chip === "Marisco") return /marisc|gamba|cigala|cabo/i.test(text);
      return true;
    case "produce":
      if (chip === "Temporada") return /temporada|mercado/i.test(text);
      if (chip === "Bio") return /bio|fresco|fruta|verdura/i.test(text);
      if (chip === "Listo cocina") return /cocina|mise en place|chef/i.test(text);
      return true;
    default:
      return true;
  }
}

export default function ProvidersByCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: CategoryCode }>();
  const categoryCode: CategoryCode = category ?? "meat";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("Todos");
  const reducedMotion = useReducedMotionPreference();

  const { data, isLoading, error } = useQuery({
    queryKey: ["providers", categoryCode],
    initialData: getDemoProducerCardsByCategory(categoryCode),
    queryFn: () => fetchProducersByCategory(categoryCode)
  });

  const subtitle = useMemo(() => {
    if (!data?.length) return "Sin proveedores disponibles";
    return `${data.length} opciones operando hoy en Sevilla`;
  }, [data]);

  const filteredProviders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return (data ?? []).filter((provider) => {
      const haystack = `${provider.name} ${provider.city} ${provider.tagline ?? ""}`.toLowerCase();
      const queryMatch = query.length === 0 || haystack.includes(query);
      const chipMatch = matchesFilterChip(categoryCode, activeChip, haystack);
      return queryMatch && chipMatch;
    });
  }, [data, searchQuery, activeChip, categoryCode]);

  return (
    <AppScreen scroll={false} dark={false} backgroundColor={colors.bgLight} style={styles.root}>
      <View style={styles.stickyHeader}>
        <View style={styles.navRow}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <MaterialCommunityIcons name="chevron-left" size={20} color={colors.textStrong} />
          </Pressable>
          <Text style={styles.title}>{categoryLabel[categoryCode]}</Text>
          <Pressable style={styles.iconButton} onPress={() => router.push("/(restaurant)/cart")}>
            <MaterialCommunityIcons name="cart-outline" size={18} color={colors.textStrong} />
          </Pressable>
        </View>

        <SectionHeader title="Mercados en tu zona" subtitle={subtitle} />
        <StickySearchHeader
          query={searchQuery}
          onChangeQuery={setSearchQuery}
          placeholder="Buscar establecimiento o producto"
          chips={categoryChips[categoryCode]}
          activeChip={activeChip}
          onPressChip={(chip) => {
            runLayoutTransition(reducedMotion);
            setActiveChip(chip);
          }}
        />
      </View>

      {error ? <EmptyState light title="No pudimos cargar proveedores" subtitle="Intenta nuevamente en unos segundos." /> : null}

      {!error ? (
        <FlatList
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          data={filteredProviders}
          ListEmptyComponent={
            isLoading ? (
              <Text style={styles.loading}>Cargando proveedores...</Text>
            ) : (
              <EmptyState
                light
                title="No hay resultados con este filtro"
                subtitle="Prueba otro filtro o limpia la búsqueda para ver más proveedores."
              />
            )
          }
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPressIn={() => warmProviderRoute(item.id)}
              onPress={() => router.push(`/(restaurant)/provider/${item.id}`)}
            >
              <AppImage
                source={item.cardImageSource ?? item.cardImage}
                fallbackSource={
                  item.cardImageSource ? undefined : [producerCardImage(item.id, categoryCode), categoryVisuals[categoryCode].coverImage]
                }
                style={styles.cardImage}
                borderRadius={0}
              />

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardTagline} numberOfLines={1}>
                  {item.tagline ?? "Suministro profesional para hostelería"}
                </Text>

                <View style={styles.metricsRow}>
                  <MetaStatPill icon="star" label={`${item.rating.toFixed(1)}`} emphasis="warning" />
                  <MetaStatPill
                    icon="time-outline"
                    label={`${item.etaMin ?? (20 + item.distanceKm * 8).toFixed(0)}-${item.etaMax ?? (28 + item.distanceKm * 8).toFixed(0)} min`}
                  />
                  <MetaStatPill icon="bicycle-outline" label={`${item.deliveryFeeEur.toFixed(2)}€`} />
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
  stickyHeader: {
    gap: 10,
    marginBottom: spacing.sm
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
  title: {
    color: colors.textStrong,
    fontSize: 30,
    lineHeight: 34,
    fontFamily: fonts.display
  },
  listContent: {
    gap: 12,
    paddingBottom: 32
  },
  loading: {
    color: colors.textSoftDark,
    textAlign: "center",
    marginTop: 20,
    fontFamily: fonts.body
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: "#D3B992",
    backgroundColor: colors.lightSurface,
    overflow: "hidden",
    ...elevation.level1
  },
  cardImage: {
    height: 182,
    width: "100%",
    backgroundColor: "#d8d8d8"
  },
  cardBody: {
    padding: 12,
    gap: 7
  },
  cardTitle: {
    color: colors.textStrong,
    fontSize: 26,
    lineHeight: 31,
    fontFamily: fonts.heading
  },
  cardTagline: {
    color: colors.textSoftDark,
    fontSize: 14,
    fontFamily: fonts.bodyStrong
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap"
  }
});
