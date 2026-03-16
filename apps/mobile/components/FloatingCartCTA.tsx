import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, elevation, fonts, radius, spacing } from "../lib/theme";
import { motionDurations, useReducedMotionPreference } from "../lib/motion";

type Props = {
  count: number;
  totalLabel: string;
  title?: string;
  onPress: () => void;
};

export function FloatingCartCTA({ count, totalLabel, title = "Ver carrito", onPress }: Props) {
  const reducedMotion = useReducedMotionPreference();
  const translateY = useRef(new Animated.Value(reducedMotion ? 0 : 20)).current;

  useEffect(() => {
    if (reducedMotion) {
      translateY.setValue(0);
      return;
    }

    const animation = Animated.timing(translateY, {
      toValue: 0,
      duration: motionDurations.base,
      useNativeDriver: true
    });

    animation.start();
    return () => animation.stop();
  }, [reducedMotion, translateY]);

  return (
    <Animated.View style={[styles.wrap, { transform: [{ translateY }] }]}> 
      <Pressable style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed, pressed && styles.ctaPressedColor]} onPress={onPress}>
        <View style={styles.row}>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{count}</Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.trailing}>
            <Text style={styles.total}>{totalLabel}</Text>
            <MaterialCommunityIcons name="arrow-right" size={17} color="#1A1A18" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: spacing.md + 6,
    right: spacing.md + 6,
    bottom: spacing.sm + 2
  },
  cta: {
    minHeight: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.floatingCartPrimary,
    overflow: "hidden",
    ...elevation.floating
  },
  ctaPressedColor: {
    backgroundColor: colors.floatingCartPressed
  },
  row: {
    minHeight: 58,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  countPill: {
    minWidth: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.floatingCartHighlight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7
  },
  countText: {
    color: "#1A1A18",
    fontSize: 17,
    fontFamily: fonts.bodyBold
  },
  title: {
    flex: 1,
    color: "#1A1A18",
    fontSize: 18,
    fontFamily: fonts.bodyBold
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  total: {
    color: "#1A1A18",
    fontSize: 20,
    fontFamily: fonts.bodyBold
  },
  ctaPressed: {
    transform: [{ scale: 0.986 }],
    opacity: 0.95
  }
});
