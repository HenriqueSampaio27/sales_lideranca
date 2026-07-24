import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { colors, borderRadius, shadows, typography, animations } from "../../theme";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  className = "",
  disabled,
  style,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-bold focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none";

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary,
          color: colors.textPrimary,
          boxShadow: shadows.glowPrimary,
        };
      case "secondary":
        return {
          backgroundColor: colors.card,
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: colors.border,
          color: colors.textPrimary,
          boxShadow: shadows.sm,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: colors.borderHover,
          color: colors.textPrimary,
        };
      case "danger":
        return {
          backgroundColor: colors.error,
          color: colors.card,
          boxShadow: shadows.glowError,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: colors.textSecondary,
        };
      default:
        return {};
    }
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-xs",
    lg: "px-6 py-2.5 text-sm",
  };

  return (
    <motion.button
      whileHover={{ y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      style={{
        borderRadius: borderRadius.xl,
        transition: animations.transitionNormal,
        fontFamily: typography.fontFamily.sans.join(", "),
        ...getVariantStyles(),
        ...style,
      }}
      className={`${baseStyles} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </motion.button>
  );
};

