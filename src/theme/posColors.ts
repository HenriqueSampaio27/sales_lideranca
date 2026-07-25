export const posColors = {
  // POS Main Layout & Surfaces
  bg: "#F8FAFC",
  headerBg: "#FFFFFF",
  headerBorder: "#E2E8F0",
  
  // Cards & Panels
  cardBg: "#FFFFFF",
  cardSecondaryBg: "#F1F5F9",
  cardBorder: "#E2E8F0",
  cardBorderHover: "#CBD5E1",

  // Typography
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",
  textInverse: "#FFFFFF",

  // Primary Accent (Construction Amber/Gold Theme)
  primary: "#FF0000",
  primaryHover: "#FF0000",
  primaryActive: "#92400E",
  primaryLight: "#F7F207",
  primaryBorder: "#FF0",

  // Status & Feedback
  success: "#16A34A",
  successHover: "#15803D",
  successLight: "#DCFCE7",
  successBorder: "#86EFAC",

  warning: "#EA580C",
  warningLight: "#FFEDD5",
  warningBorder: "#FDBA74",

  danger: "#DC2626",
  dangerHover: "#B91C1C",
  dangerLight: "#FEF2F2",
  dangerBorder: "#FCA5A5",

  // Quote / Orçamento Mode
  quoteModeBg: "#D97706",
  quoteModeActiveBg: "#EA580C",

  // Cart & Table Specific Colors
  tableHeaderBg: "#F8FAFC",
  tableRowBg: "#FFFFFF",
  tableRowHoverBg: "#F8FAFC",
  tableRowSelectedBg: "#FEF3C7",
  tableRowSelectedBorder: "#FDE68A",

  // POS Shortcut Bar
  shortcutBg: "#F8FAFC",
  shortcutBorder: "#E2E8F0",
  shortcutKeyText: "#DC2626",

  // Total Box / Checkout Summary
summaryBg: "#FFFFFF",
summaryBorder: "#E5E7EB",
totalBoxBg: "#F8FAFC",
totalBoxBorder: "#CBD5E1",
totalText: "#DC2626",

  // Modals & Inputs
  overlay: "rgba(15, 23, 42, 0.4)",
  modalBg: "#FFFFFF",
  modalBorder: "#E2E8F0",
  inputBg: "#F8FAFC",
  inputBorder: "#CBD5E1",
  inputFocusBorder: "#D97706",
} as const;

export type POSColors = typeof posColors;
