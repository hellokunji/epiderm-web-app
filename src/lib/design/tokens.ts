/**
 * Epiderm design tokens — Gold & White theme.
 * Swap `brand` / `semantic` values here to reconfigure the visual system.
 * Values are applied as CSS custom properties in globals.css.
 */

export const brand = {
  name: "Epiderm",
  gold: {
    50: "#FBF7EF",
    100: "#F5ECD7",
    200: "#EBD6AE",
    300: "#E0C085",
    400: "#D4A85C",
    500: "#C4923A",
    600: "#A67830",
    700: "#845E27",
    800: "#62461D",
    900: "#412E14",
  },
  white: {
    pure: "#FFFFFF",
    soft: "#FAFAF8",
    muted: "#F3F1EC",
  },
  ink: {
    50: "#F7F6F4",
    100: "#E8E6E1",
    200: "#D1CEC6",
    300: "#A8A49A",
    400: "#7A766C",
    500: "#524E46",
    600: "#3A372F",
    700: "#2A2822",
    800: "#1C1B17",
    900: "#12110E",
  },
} as const;

/** Semantic light theme mapped from brand tokens */
export const lightTheme = {
  background: brand.white.soft,
  foreground: brand.ink[800],
  muted: brand.white.muted,
  "muted-foreground": brand.ink[400],
  card: brand.white.pure,
  "card-foreground": brand.ink[800],
  primary: brand.gold[500],
  "primary-foreground": brand.white.pure,
  "primary-hover": brand.gold[600],
  secondary: brand.gold[100],
  "secondary-foreground": brand.gold[800],
  accent: brand.gold[400],
  "accent-foreground": brand.ink[900],
  border: brand.ink[100],
  ring: brand.gold[400],
  destructive: "#B42318",
  "destructive-foreground": brand.white.pure,
  success: "#067647",
  input: brand.ink[100],
  "input-focus": brand.gold[400],
} as const;

/** Semantic dark theme mapped from brand tokens */
export const darkTheme = {
  background: brand.ink[900],
  foreground: brand.ink[50],
  muted: brand.ink[800],
  "muted-foreground": brand.ink[300],
  card: brand.ink[800],
  "card-foreground": brand.ink[50],
  primary: brand.gold[400],
  "primary-foreground": brand.ink[900],
  "primary-hover": brand.gold[300],
  secondary: brand.ink[700],
  "secondary-foreground": brand.gold[200],
  accent: brand.gold[500],
  "accent-foreground": brand.ink[900],
  border: brand.ink[700],
  ring: brand.gold[400],
  destructive: "#F97066",
  "destructive-foreground": brand.ink[900],
  success: "#47CD89",
  input: brand.ink[700],
  "input-focus": brand.gold[400],
} as const;

export const radii = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
} as const;

export const motion = {
  fast: "120ms",
  base: "200ms",
  slow: "320ms",
} as const;

export type ThemeMode = "light" | "dark";
