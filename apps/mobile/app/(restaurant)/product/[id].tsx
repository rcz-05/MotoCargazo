import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { EmptyState } from "../../../components/EmptyState";
import { AppImage } from "../../../components/AppImage";
import { fetchProductById } from "../../../lib/api";
import { getDemoProductById } from "../../../lib/demoCatalog";
import { buildImageFallbackChain } from "../../../lib/demoMedia";
import { useCartStore } from "../../../store/cart-store";
import { colors, elevation, fonts, radius, spacing } from "../../../lib/theme";

type Addon = {
  id: string;
  label: string;
  price: number;
};

type AddonGroup = {
  id: string;
  title: string;
  max: number;
  options: Addon[];
};

function buildAddonGroups(category: "meat" | "seafood" | "produce"): AddonGroup[] {
  if (category === "seafood") {
    return [
      {
        id: "preparacion",
        title: "Preparación del pedido",
        max: 1,
        options: [
          { id: "limpio", label: "Limpio y listo para cocina", price: 1.5 },
          { id: "porcionado", label: "Porcionado para servicio", price: 2.4 }
        ]
      },
      {
        id: "extra",
        title: "Extras logísticos",
        max: 2,
        options: [
          { id: "hielo", label: "Con cama de hielo extra", price: 0.95 },
          { id: "urgent", label: "Prioridad de carga", price: 2.1 }
        ]
      }
    ];
  }

  return [
    {
      id: "corte",
      title: "Preparación de producto",
      max: 2,
      options: [
        { id: "porcionado", label: "Porcionado gastronómico", price: 1.25 },
        { id: "vacio", label: "Envasado al vacío", price: 1.5 },
        { id: "etiquetado", label: "Etiquetado por lote", price: 0.8 }
      ]
    },
    {
      id: "logistica",
      title: "Logística adicional",
      max: 1,
      options: [
        { id: "frio", label: "Cadena de frío reforzada", price: 2.2 },
        { id: "am", label: "Entrega primera hora", price: 3.4 }
      ]
    }
  ];
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", id],
    enabled: Boolean(id),
    initialData: id ? getDemoProductById(id) ?? undefined : undefined,
    queryFn: () => fetchProductById(id)
  });

  if (isLoading) {
    return (
      <AppScreen dark={false} backgroundColor={colors.bgLight}>
        <Text style={styles.infoText}>Cargando producto...</Text>
      </AppScreen>
    );
  }

  if (error || !data) {
    return (
      <AppScreen dark={false} backgroundColor={colors.bgLight}>
        <EmptyState light title="No pudimos cargar este producto" subtitle="Vuelve a intentarlo desde el catálogo." />
      </AppScreen>
    );
  }

  const addonGroups = buildAddonGroups(data.category_code);
  const imageFallback = data.image_source ? data.image_fallback_source : buildImageFallbackChain(data.category_code, data.image_url);

  const selectedExtrasTotal = useMemo(() => {
    return addonGroups.reduce((sum, group) => {
      for (const option of group.options) {
        if (selected[option.id]) sum += option.price;
      }
      return sum;
    }, 0);
  }, [addonGroups, selected]);

  const basePrice = Number(data.base_price_eur);
  const unitPriceWithExtras = basePrice + selectedExtrasTotal;
  const total = unitPriceWithExtras * quantity;

  return (
    <AppScreen scroll={false} dark={false} backgroundColor={colors.bgLight} style={styles.root}>
      <View style={styles.imageArea}>
        <AppImage source={data.image_source ?? data.image_url} fallbackSource={imageFallback} style={styles.heroImage} borderRadius={0} />
        <View style={styles.imageOverlay} />
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={20} color={colors.white} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentBody} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.price}>{`${basePrice.toFixed(2)}€`}</Text>
        </View>
        <Text style={styles.description}>{data.description ?? "Producto fresco seleccionado para cocina profesional."}</Text>

        {addonGroups.map((group) => {
          const selectedCount = group.options.filter((option) => selected[option.id]).length;

          return (
            <View key={group.id} style={styles.optionGroup}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <Text style={styles.groupHint}>{`Escoge un máximo de ${group.max} opciones`}</Text>

              {group.options.map((option) => {
                const checked = Boolean(selected[option.id]);
                return (
                  <Pressable
                    key={option.id}
                    style={styles.optionRow}
                    onPress={() => {
                      if (checked) {
                        setSelected((prev) => ({ ...prev, [option.id]: false }));
                        return;
                      }

                      if (selectedCount >= group.max) return;
                      setSelected((prev) => ({ ...prev, [option.id]: true }));
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.optionLabel}>{option.label}</Text>
                      <Text style={styles.optionPrice}>{`+${option.price.toFixed(2)}€`}</Text>
                    </View>
                    <View style={[styles.optionToggle, checked && styles.optionToggleActive]}>
                      <MaterialCommunityIcons name={checked ? "check" : "plus"} size={16} color={checked ? colors.white : colors.brandDark} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantityRow}>
          <Pressable style={styles.quantityButton} onPress={() => setQuantity((value) => Math.max(1, value - 1))}>
            <MaterialCommunityIcons name="minus" size={18} color={colors.brandDark} />
          </Pressable>
          <Text style={styles.quantityText}>{quantity}</Text>
          <Pressable style={styles.quantityButton} onPress={() => setQuantity((value) => value + 1)}>
            <MaterialCommunityIcons name="plus" size={18} color={colors.brandDark} />
          </Pressable>
        </View>

        <PrimaryButton
          title={`Añadir por ${total.toFixed(2)}€`}
          onPress={() => {
            addItem(
              {
                productId: data.id,
                producerId: data.producer_id,
                category: data.category_code,
                name: data.name,
                unit: data.unit,
                unitPriceEur: unitPriceWithExtras,
                imageUrl: data.image_url,
                imageSource: data.image_source
              },
              quantity
            );
            router.push("/(restaurant)/cart");
          }}
          style={styles.addButton}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 0
  },
  imageArea: {
    position: "relative"
  },
  heroImage: {
    width: "100%",
    height: 280,
    backgroundColor: "#d8d8d8"
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)"
  },
  closeButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    flex: 1
  },
  contentBody: {
    paddingHorizontal: spacing.md,
    paddingTop: 12,
    gap: 10
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10
  },
  title: {
    flex: 1,
    color: colors.textStrong,
    fontSize: 33,
    lineHeight: 38,
    fontFamily: fonts.display
  },
  price: {
    color: colors.textStrong,
    fontSize: 31,
    lineHeight: 34,
    fontFamily: fonts.bodyBold
  },
  description: {
    color: colors.textSoftDark,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: fonts.bodyStrong
  },
  optionGroup: {
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: "#D3B992",
    backgroundColor: colors.lightSurface,
    padding: 12,
    gap: 8,
    ...elevation.level1
  },
  groupTitle: {
    color: colors.textStrong,
    fontSize: 21,
    lineHeight: 26,
    fontFamily: fonts.heading
  },
  groupHint: {
    color: colors.textSoftDark,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 5
  },
  optionLabel: {
    color: colors.textStrong,
    fontSize: 15,
    fontFamily: fonts.bodyBold
  },
  optionPrice: {
    color: colors.brandDark,
    fontSize: 14,
    marginTop: 1,
    fontFamily: fonts.bodyStrong
  },
  optionToggle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#385026",
    backgroundColor: "#E7F0DA",
    alignItems: "center",
    justifyContent: "center"
  },
  optionToggleActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brandDark
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 2,
    borderColor: "#D3B992",
    backgroundColor: colors.lightSurface,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    ...elevation.floating
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#385026",
    backgroundColor: "#E7F0DA",
    alignItems: "center",
    justifyContent: "center"
  },
  quantityText: {
    minWidth: 22,
    textAlign: "center",
    color: colors.textStrong,
    fontSize: 20,
    fontFamily: fonts.bodyBold
  },
  addButton: {
    flex: 1
  },
  infoText: {
    color: colors.textSoftDark,
    fontSize: 16,
    fontFamily: fonts.body
  }
});
