import React from "react";
import { colors, borderRadius, typography } from "../../theme";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "error" | "warning" | "neutral";
  size?: "sm" | "md";
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  icon,
  className = "",
  style,
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primaryLight,
          color: colors.primary,
          borderColor: colors.primaryLight,
        };
      case "success":
        return {
          backgroundColor: "#F0FDF4",
          color: colors.success,
          borderColor: "#BBF7D0",
        };
      case "error":
        return {
          backgroundColor: "#FEF2F2",
          color: colors.error,
          borderColor: "#FECACA",
        };
      case "warning":
        return {
          backgroundColor: colors.primaryLight,
          color: colors.warning,
          borderColor: "#FDE68A",
        };
      case "neutral":
      default:
        return {
          backgroundColor: colors.cardSecondary,
          color: colors.textSecondary,
          borderColor: colors.border,
        };
    }
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-[11px]",
  };

  return (
    <span
      style={{
        borderRadius: borderRadius.full,
        borderWidth: "1px",
        borderStyle: "solid",
        fontFamily: typography.fontFamily.sans.join(", "),
        ...getVariantStyles(),
        ...style,
      }}
      className={`inline-flex items-center gap-1 font-semibold ${sizes[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

