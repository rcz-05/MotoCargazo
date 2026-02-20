import { useLocalSearchParams, router } from "expo-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppScreen } from "../../../components/AppScreen";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { EmptyState } from "../../../components/EmptyState";
import { fetchProductById } from "../../../lib/api";
import { useCartStore } from "../../../store/cart-store";
import { colors, fonts, radius, spacing } from "../../../lib/theme";

const fallbackImage =
  "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80";

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
        title: "Extras",
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
      title: "Preparación de carne",
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
        <Image source={{ uri: data.image_url ?? fallbackImage }} style={styles.heroImage} />
        <Pressable style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={20} color={colors.white} />
        </Pressable>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentBody} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{data.name}</Text>
        <Text style={styles.price}>{`${basePrice.toFixed(2)}€`}</Text>
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
                      <Ionicons name={checked ? "checkmark" : "add"} size={16} color={checked ? colors.white : colors.brandDark} />
                    </View>
                  </Pressable>
                );
              })}
            </View>
          );
        })}

        <View style={{ height: 36 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantityRow}>
          <Pressable style={styles.quantityButton} onPress={() => setQuantity((value) => Math.max(1, value - 1))}>
            <Ionicons name="remove" size={18} color={colors.brandDark} />
          </Pressable>
          <Text style={styles.quantityText}>{quantity}</Text>
          <Pressable style={styles.quantityButton} onPress={() => setQuantity((value) => value + 1)}>
            <Ionicons name="add" size={18} color={colors.brandDark} />
          </Pressable>
        </View>

        <PrimaryButton
          title={`Añadir por ${total.toFixed(2)}€`}
          onPress={() => {
            addItem(
              {
                productId: data.id,
                producerId: data.producer_id,
                name: data.name,
                unit: data.unit,
                unitPriceEur: unitPriceWithExtras,
                imageUrl: data.image_url
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
  title: {
    color: colors.textStrong,
    fontSize: 37,
    lineHeight: 41,
    fontFamily: fonts.heading
  },
  price: {
    color: colors.textStrong,
    fontSize: 30,
    lineHeight: 34,
    fontFamily: fonts.heading
  },
  description: {
    color: colors.textSoftDark,
    fontSize: 15,
    lineHeight: 21,
    fontFamily: fonts.body
  },
  optionGroup: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 12,
    gap: 8
  },
  groupTitle: {
    color: colors.textStrong,
    fontSize: 22,
    lineHeight: 27,
    fontFamily: fonts.heading
  },
  groupHint: {
    color: colors.textSoftDark,
    fontSize: 12,
    fontFamily: fonts.body
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
    fontFamily: fonts.bodyStrong
  },
  optionPrice: {
    color: colors.brandDark,
    fontSize: 13,
    marginTop: 1,
    fontFamily: fonts.body
  },
  optionToggle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#9cdcb0",
    backgroundColor: "#e8f8ed",
    alignItems: "center",
    justifyContent: "center"
  },
  optionToggleActive: {
    backgroundColor: colors.brand,
    borderColor: colors.brandDark
  },
  bottomBar: {
    borderTopWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    paddingHorizontal: spacing.md,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
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
    borderWidth: 1,
    borderColor: "#9cdcb0",
    backgroundColor: "#e8f8ed",
    alignItems: "center",
    justifyContent: "center"
  },
  quantityText: {
    minWidth: 22,
    textAlign: "center",
    color: colors.textStrong,
    fontSize: 20,
    fontFamily: fonts.heading
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
