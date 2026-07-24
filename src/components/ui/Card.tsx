import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { colors, borderRadius, shadows, typography, spacing, animations } from "../../theme";

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "primary",
  hoverable = false,
  className = "",
  style,
  ...props
}) => {
  const bgStyles: React.CSSProperties =
    variant === "primary"
      ? {
          backgroundColor: colors.card,
          borderColor: colors.border,
          boxShadow: shadows.sm,
        }
      : {
          backgroundColor: colors.background,
          borderColor: colors.border,
        };

  return (
    <motion.div
      whileHover={hoverable ? { y: -3 } : undefined}
      style={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: borderRadius["2xl"],
        padding: spacing.md,
        transition: animations.transitionNormal,
        fontFamily: typography.fontFamily.sans.join(", "),
        ...bgStyles,
        ...style,
      }}
      className={`relative overflow-hidden ${
        hoverable ? "hover:border-slate-300 hover:shadow-md" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = "",
  style,
}) => (
  <div
    style={{ marginBottom: spacing.md, ...style }}
    className={`flex items-center justify-between ${className}`}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = "",
  style,
}) => (
  <h3
    style={{
      color: colors.textPrimary,
      fontFamily: typography.fontFamily.sans.join(", "),
      fontWeight: typography.fontWeight.bold,
      fontSize: typography.fontSize.base,
      ...style,
    }}
    className={`tracking-tight ${className}`}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = "",
  style,
}) => (
  <p
    style={{
      color: colors.textSecondary,
      fontFamily: typography.fontFamily.sans.join(", "),
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.normal,
      ...style,
    }}
    className={className}
  >
    {children}
  </p>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string; style?: React.CSSProperties }> = ({
  children,
  className = "",
  style,
}) => <div style={style} className={`${className}`}>{children}</div>;

