export const dashboardTheme = {
  // Container & Surfaces
  bg: "#F8FAFC",
  card: "#FFFFFF",
  cardSecondary: "#F1F5F9",
  cardHover: "#FAFAFA",
  border: "#E5E7EB",
  borderHover: "#CBD5E1",
  borderFocus: "#DC2626",

  // Typography
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  // Red Identity (ERP Management Theme)
  primaryRed: "#DC2626",      // Main red accent
  darkRed: "#991B1B",         // Deep red header/text accent
  lightRed: "#FEE2E2",        // Soft red background for badges/cards
  borderRed: "#FCA5A5",       // Subtle red border
  hoverRed: "#B91C1C",        // Hover state for red buttons
  badgeRedText: "#991B1B",

  // Status Indicators
  success: "#16A34A",
  successBg: "#DCFCE7",
  successBorder: "#BBF7D0",
  successText: "#15803D",

  warning: "#D97706",
  warningBg: "#FEF3C7",
  warningBorder: "#FDE68A",
  warningText: "#B45309",

  danger: "#DC2626",
  dangerBg: "#FEE2E2",
  dangerBorder: "#FCA5A5",
  dangerText: "#991B1B",

  info: "#2563EB",
  infoBg: "#DBEAFE",
  infoBorder: "#BFDBFE",
  infoText: "#1D4ED8",

  // Charts Palette (Red & Neutral Tones)
  chart: {
    primary: "#DC2626",        // Red primary line/bar
    secondary: "#991B1B",      // Deep red comparison
    tertiary: "#475569",       // Neutral slate bar
    expenses: "#E11D48",       // Rose red for expenses
    pending: "#D97706",        // Amber for pending
    paid: "#16A34A",           // Emerald green for paid
    grid: "#E2E8F0",
    tooltipBg: "#FFFFFF",
    tooltipBorder: "#CBD5E1",
    tooltipText: "#0F172A",
  },
} as const;

export type DashboardTheme = typeof dashboardTheme;
