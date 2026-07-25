export const colors = {
  background: "#F8FAFC",
  card: "#FFFFFF",
  cardSecondary: "#F1F5F9",
  border: "#E2E8F0",
  borderHover: "#CBD5E1",
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  primary: "#D97706",
  primaryHover: "#B45309",
  primaryLight: "#FEF3C7",
  success: "#16A34A",
  successLight: "#DCFCE7",
  successBorder: "#86EFAC",
  error: "#DC2626",
  errorLight: "#FEF2F2",
  errorBorder: "#FCA5A5",
  warning: "#D97706",
  warningLight: "#FEF3C7",
  warningBorder: "#FDE68A",
  overlay: "rgba(15, 23, 42, 0.4)",
} as const;

export type Colors = typeof colors;
