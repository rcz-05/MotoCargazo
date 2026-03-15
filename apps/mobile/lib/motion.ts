import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager
} from "react-native";

const enabledLayoutAnimation = (() => {
  if (Platform.OS !== "android") return true;
  try {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
    return true;
  } catch {
    return false;
  }
})();

export const motionDurations = {
  fast: 140,
  base: 240,
  slow: 420
} as const;

export const motionStagger = {
  screenEnter: 80
} as const;

export function useReducedMotionPreference() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReducedMotion(enabled);
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => {
      if (mounted) setReducedMotion(enabled);
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reducedMotion;
}

export function useEntranceAnimation(options?: {
  delay?: number;
  distance?: number;
  duration?: number;
  reducedMotion?: boolean;
}) {
  const {
    delay = 0,
    distance = 14,
    duration = motionDurations.base,
    reducedMotion = false
  } = options ?? {};

  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) {
      progress.setValue(1);
      return;
    }

    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    });

    animation.start();
    return () => animation.stop();
  }, [progress, delay, duration, reducedMotion]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [distance, 0]
  });

  return {
    opacity: progress,
    transform: [{ translateY }]
  } as const;
}

export function runLayoutTransition(reducedMotion: boolean) {
  if (reducedMotion || !enabledLayoutAnimation) return;
  LayoutAnimation.configureNext(
    LayoutAnimation.create(
      motionDurations.base,
      LayoutAnimation.Types.easeInEaseOut,
      LayoutAnimation.Properties.opacity
    )
  );
}
