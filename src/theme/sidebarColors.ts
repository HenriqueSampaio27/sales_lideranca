export const sidebarColors = {
  // Container & Surfaces
  bg: "#FFFFFF",
  itemBg: "#F8FAFC",
  itemHoverBg: "#F8FAFC",
  border: "#E2E8F0",
  borderHover: "#CBD5E1",

  // Typography
  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  // Brand & Accents
  primary: "#FF0000",
  accent: "#DC2626",

  // Active Item Theme
  activeBg: "#FF0000",
  activeBorder: "#FF0000",
  activeText: "#FFFFFF",
  activeIcon: "#FFFFFF",

  // Header Brand Logo Badge
  badgeBg: "#FEF3C7",
  badgeBorder: "#FDE68A",
  badgeIcon: "#B45309",

  // User Profile Footer Card
  userCardBg: "#F8FAFC",
  userCardBorder: "#E2E8F0",
  userAvatarBg: "#FEF3C7",
  userAvatarBorder: "#FDE68A",
  userAvatarText: "#D97706",
  userLogoutHoverText: "#DC2626",
  userLogoutHoverBg: "#FEF2F2",
} as const;

export type SidebarColors = typeof sidebarColors;
