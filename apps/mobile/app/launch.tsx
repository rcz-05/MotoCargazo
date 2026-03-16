import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { isDemoApp } from "../lib/app-mode";
import { colors, elevation, fonts, gradients, radius } from "../lib/theme";
import { markLaunchSeen } from "../lib/launch-state";
import { motionDurations, useReducedMotionPreference } from "../lib/motion";

export default function LaunchScreen() {
  const reducedMotion = useReducedMotionPreference();
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(reducedMotion ? 0 : 28)).current;
  const scale = useRef(new Animated.Value(reducedMotion ? 1 : 0.97)).current;

  useEffect(() => {
    if (reducedMotion) {
      opacity.setValue(1);
      translateY.setValue(0);
      scale.setValue(1);
      return;
    }

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motionDurations.slow,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motionDurations.slow,
        useNativeDriver: true
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: motionDurations.slow,
        useNativeDriver: true
      })
    ]);

    animation.start();
    return () => animation.stop();
  }, [opacity, reducedMotion, scale, translateY]);

  const handleContinue = async () => {
    await markLaunchSeen();
    router.replace("/");
  };

  return (
    <LinearGradient colors={gradients.lightScreen} style={styles.container}>
      <View pointerEvents="none" style={styles.meshTop} />
      <View pointerEvents="none" style={styles.meshBottom} />

      <Animated.View style={[styles.card, { opacity, transform: [{ translateY }, { scale }] }]}> 
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="silverware-fork-knife" size={16} color={colors.brandDark} />
            <Text style={styles.badgeText}>Sevilla Market Ops</Text>
          </View>
          <View style={styles.signalBadge}>
            <MaterialCommunityIcons name="waves" size={14} color={colors.accent} />
            <Text style={styles.signalText}>{isDemoApp ? "Demo" : "Live"}</Text>
          </View>
        </View>

        <Text style={styles.brand}>MotoCargo</Text>
        <Text style={styles.title}>
          {isDemoApp ? "Recorrido restaurante listo para explorar." : "Cadena editorial para restaurantes."}
        </Text>
        <Text style={styles.subtitle}>
          {isDemoApp
            ? "Explora catálogo, carrito y checkout con datos curados para la demo pública."
            : "Contratos, catálogo y logística urbana en una experiencia de compra diseñada para ritmo real de cocina."}
        </Text>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Mercados activos</Text>
            <Text style={styles.metricValue}>25+</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>ETA medio</Text>
            <Text style={styles.metricValue}>28 min</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Operación</Text>
            <Text style={styles.metricValue}>B2B</Text>
          </View>
        </View>

        <Pressable onPress={handleContinue} style={styles.cta}>
          <Text style={styles.ctaText}>{isDemoApp ? "Abrir demo restaurante" : "Entrar al panel"}</Text>
          <MaterialCommunityIcons name="arrow-right" size={18} color="#1A1A18" />
        </Pressable>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20
  },
  meshTop: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    top: -120,
    right: -110,
    backgroundColor: "rgba(166,106,67,0.17)"
  },
  meshBottom: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    bottom: -100,
    left: -80,
    backgroundColor: "rgba(47,111,115,0.12)"
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: "rgba(79,57,34,0.16)",
    backgroundColor: colors.surfaceOverlay,
    padding: 22,
    gap: 14,
    ...elevation.level2
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(166,106,67,0.3)",
    backgroundColor: "rgba(255,253,250,0.85)",
    paddingHorizontal: 10,
    minHeight: 30,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6
  },
  badgeText: {
    color: colors.brandDark,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  signalBadge: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "rgba(47,111,115,0.35)",
    backgroundColor: "rgba(244,251,251,0.8)",
    paddingHorizontal: 10,
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  signalText: {
    color: colors.accent,
    fontSize: 12,
    fontFamily: fonts.bodyStrong
  },
  brand: {
    color: colors.textStrong,
    fontSize: 38,
    lineHeight: 42,
    fontFamily: fonts.heading
  },
  title: {
    color: colors.textStrong,
    fontSize: 28,
    lineHeight: 33,
    fontFamily: fonts.heading
  },
  subtitle: {
    color: colors.textSoftDark,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: fonts.body
  },
  metricRow: {
    flexDirection: "row",
    gap: 8
  },
  metricCard: {
    flex: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lightBorder,
    backgroundColor: colors.lightSurface,
    padding: 10,
    gap: 2
  },
  metricLabel: {
    color: colors.textSoftDark,
    fontSize: 11,
    fontFamily: fonts.body
  },
  metricValue: {
    color: colors.textStrong,
    fontSize: 20,
    lineHeight: 24,
    fontFamily: fonts.heading
  },
  cta: {
    minHeight: 58,
    borderRadius: radius.pill,
    backgroundColor: colors.floatingCartPrimary,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    ...elevation.level1
  },
  ctaText: {
    color: "#1A1A18",
    fontSize: 18,
    fontFamily: fonts.bodyBold
  }
});
