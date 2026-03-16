import { Platform } from "react-native";

export const colors = {
  // Editorial Mercado Luxe v2 palette
  brand: "#A66A43",
  brandDark: "#6D3F24",
  brandSoft: "#EFD7C6",
  accent: "#2F6F73",
  brandYellow: "#D9B58A",
  mint: "#DCE9DF",

  // Semantic surfaces
  surfaceBase: "#F8F3E8",
  surfaceElevated: "#FFFDFC",
  surfaceInset: "#EFE7D8",
  surfaceOverlay: "rgba(255, 253, 250, 0.9)",

  // Semantic text tiers
  textPrimaryStrong: "#1F1A16",
  textBody: "#5D5146",
  textTertiary: "#8A7D72",
  textInverse: "#FFFDFC",

  // Semantic actions — warm Mediterranean teal (Glovo-inspired, azulejo palette)
  actionPrimary: "#5B9A93",
  actionPrimaryPressed: "#4F8781",
  actionPrimaryBorder: "#3F736D",
  actionPrimaryHighlight: "#A8D0CB",
  floatingCartPrimary: "#7FAEBF",
  floatingCartPressed: "#6F9DAD",
  floatingCartHighlight: "#D9E7ED",
  actionSecondary: "#F1E9DD",
  actionSecondaryBorder: "#D8CCBD",
  actionGhost: "#F6EFE2",

  // Feedback
  success: "#3E7D57",
  warning: "#A4792D",
  danger: "#C9504D",
  info: "#356B9C",

  // Legacy dark palette (backward compatibility)
  bgDark: "#1D222B",
  bgDarkSoft: "#2A303B",
  bgCard: "#242B36",
  bgCardElevated: "#303949",

  // Backward-compatible aliases used across existing screens
  bgLight: "#F8F3E8",
  lightSurface: "#FFFDFC",
  lightSurfaceSoft: "#F5EEE3",
  lightBorder: "#DFCDB6",
  textPrimary: "#EBEDF0",
  textSecondary: "#C0C7D0",
  textMuted: "#909AA5",
  textDark: "#1F1A16",
  textStrong: "#1F1A16",
  textSoftDark: "#5D5146",
  border: "#3A4453",
  borderSoft: "#303B4B",
  white: "#FFFFFF",
  mutedCard: "#3A4557"
};

export const semantic = {
  page: {
    surfaceBase: colors.surfaceBase,
    surfaceElevated: colors.surfaceElevated,
    surfaceInset: colors.surfaceInset
  },
  text: {
    primary: colors.textPrimaryStrong,
    secondary: colors.textBody,
    tertiary: colors.textTertiary,
    inverse: colors.textInverse
  },
  action: {
    primary: colors.actionPrimary,
    primaryPressed: colors.actionPrimaryPressed,
    primaryBorder: colors.actionPrimaryBorder,
    secondary: colors.actionSecondary,
    secondaryBorder: colors.actionSecondaryBorder,
    ghost: colors.actionGhost
  },
  feedback: {
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    info: colors.info
  }
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 44
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 34,
  pill: 999
};

export const typeScale = {
  display: 44,
  title: 36,
  h1: 31,
  h2: 25,
  h3: 21,
  body: 16,
  small: 13,
  caption: 12
};

const fallbackHeading = Platform.select({ ios: "Times New Roman", android: "serif", default: "serif" }) as string;
const fallbackBody = Platform.select({ ios: "AvenirNext-Regular", android: "sans-serif", default: "System" }) as string;

export const fonts = {
  display: "PlayfairDisplay-Bold",
  heading: "PlayfairDisplay-Regular",
  body: "Manrope-Regular",
  bodyStrong: "Manrope-SemiBold",
  bodyBold: "Manrope-Bold",
  fallbackHeading,
  fallbackBody
};

export const gradients = {
  darkScreen: ["#1B1E26", "#262C38", "#323D4D"] as const,
  lightScreen: ["#F8F3E8", "#F2E8D7", "#EADCC8"] as const,
  marketHero: ["#D8BE9B", "#C79D75", "#A66A43"] as const,
  promoCard: ["#F9F3E8", "#F4EBDD"] as const,
  card: ["#3B485D", "#2D394B"] as const,
  button: ["#7A8D52", "#5D6B3F"] as const,
  buttonDark: ["#3D4D63", "#2E394B"] as const
};

export const elevation = {
  level1: {
    shadowColor: "#4A3828",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  level2: {
    shadowColor: "#3B2A1A",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 7 },
    elevation: 6
  },
  floating: {
    shadowColor: "#2B1E13",
    shadowOpacity: 0.24,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 9 },
    elevation: 9
  }
} as const;
