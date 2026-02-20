import { Platform } from "react-native";

export const colors = {
  brand: "#33b45b",
  brandDark: "#1f8b43",
  brandSoft: "#8fe89a",
  accent: "#f7c85a",
  brandYellow: "#f5cc47",
  mint: "#dff8e6",
  bgDark: "#0b1020",
  bgDarkSoft: "#131b31",
  bgCard: "#18233c",
  bgCardElevated: "#1e2b48",
  bgLight: "#f4f6f9",
  lightSurface: "#ffffff",
  lightSurfaceSoft: "#eef2f6",
  lightBorder: "#dfe4ea",
  textPrimary: "#f8fbff",
  textSecondary: "#acb7d2",
  textMuted: "#7d8bb0",
  textDark: "#111216",
  textStrong: "#121619",
  textSoftDark: "#68707a",
  danger: "#ff6f6f",
  warning: "#e4b24f",
  success: "#6de08c",
  border: "#2a3657",
  borderSoft: "#22304f",
  white: "#ffffff",
  mutedCard: "#2f3240"
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999
};

export const typeScale = {
  title: 38,
  h1: 32,
  h2: 26,
  h3: 20,
  body: 16,
  small: 13
};

export const fonts = {
  heading: Platform.select({ ios: "AvenirNext-Bold", android: "sans-serif-medium", default: "System" }) as string,
  body: Platform.select({ ios: "AvenirNext-Regular", android: "sans-serif", default: "System" }) as string,
  bodyStrong: Platform.select({ ios: "AvenirNext-DemiBold", android: "sans-serif-medium", default: "System" }) as string
};

export const gradients = {
  darkScreen: ["#060a17", "#0a1225", "#101b34"] as const,
  lightScreen: ["#f5cc47", "#f7d462", "#ffe595"] as const,
  card: ["#1e2b48", "#17233e"] as const,
  button: ["#64df76", "#4dae57"] as const,
  buttonDark: ["#1b2d4e", "#131f38"] as const
};
