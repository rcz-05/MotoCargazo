import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FilterChip } from "./FilterChip";
import { colors, elevation, radius, spacing } from "../lib/theme";

type Props = {
  query: string;
  onChangeQuery: (value: string) => void;
  placeholder: string;
  chips?: string[];
  activeChip?: string;
  onPressChip?: (chip: string) => void;
};

export function StickySearchHeader({
  query,
  onChangeQuery,
  placeholder,
  chips = [],
  activeChip,
  onPressChip
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={18} color={colors.textSoftDark} />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder={placeholder}
          placeholderTextColor={colors.textSoftDark}
          style={styles.input}
          returnKeyType="search"
        />
        {query ? (
          <Pressable onPress={() => onChangeQuery("")}>
            <MaterialCommunityIcons name="close-circle-outline" size={18} color={colors.textSoftDark} />
          </Pressable>
        ) : null}
      </View>

      {chips.length ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {chips.map((chip) => (
            <FilterChip
              key={chip}
              label={chip}
              selected={chip === activeChip}
              onPress={() => onPressChip?.(chip)}
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs
  },
  searchBar: {
    minHeight: 46,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    ...elevation.level1
  },
  input: {
    flex: 1,
    color: colors.textStrong,
    fontSize: 14,
    paddingVertical: 0
  },
  chipsRow: {
    gap: 8,
    paddingVertical: 2
  }
});
