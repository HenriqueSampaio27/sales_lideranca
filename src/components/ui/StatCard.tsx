import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { colors, borderRadius, shadows, typography, spacing, animations } from "../../theme";

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: "primary" | "success" | "error" | "warning" | "neutral";
  index?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: IconComponent,
  variant = "neutral",
  index = 0,
}) => {
  const styles = {
    primary: {
      color: colors.primary,
      bgColor: colors.primaryLight,
      borderColor: "#FDE68A",
    },
    success: {
      color: colors.success,
      bgColor: "#F0FDF4",
      borderColor: "#BBF7D0",
    },
    error: {
      color: colors.error,
      bgColor: "#FEF2F2",
      borderColor: "#FECACA",
    },
    warning: {
      color: colors.warning,
      bgColor: colors.primaryLight,
      borderColor: "#FDE68A",
    },
    neutral: {
      color: colors.textSecondary,
      bgColor: colors.cardSecondary,
      borderColor: colors.border,
    },
  };

  const currentStyle = styles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: "1px",
        borderStyle: "solid",
        padding: spacing.md,
        borderRadius: borderRadius["2xl"],
        boxShadow: shadows.sm,
        transition: animations.transitionNormal,
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className="relative overflow-hidden hover:border-slate-300 hover:shadow-md group"
    >
      <div className="flex items-center justify-between mb-3">
        <span
          style={{
            color: colors.textSecondary,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.semibold,
          }}
          className="uppercase tracking-wider"
        >
          {label}
        </span>
        <div
          style={{
            backgroundColor: currentStyle.bgColor,
            borderColor: currentStyle.borderColor,
            borderRadius: borderRadius.xl,
            borderWidth: "1px",
            borderStyle: "solid",
            padding: spacing.sm,
          }}
          className="transition-transform duration-300 group-hover:scale-110 flex items-center justify-center"
        >
          <IconComponent
            style={{ color: currentStyle.color }}
            className="w-5 h-5"
          />
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-2">
        <span
          style={{
            color: colors.textPrimary,
            fontSize: typography.fontSize["3xl"],
            fontWeight: typography.fontWeight.extrabold,
          }}
          className="tracking-tight"
        >
          {value}
        </span>
      </div>

      {subtext && (
        <p
          style={{
            color: colors.textSecondary,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.normal,
          }}
          className="mt-2"
        >
          {subtext}
        </p>
      )}
    </motion.div>
  );
};

