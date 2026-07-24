import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { colors, borderRadius, shadows, typography, spacing, animations } from "../../theme";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = "5xl",
}) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: borderRadius["2xl"],
            boxShadow: shadows.xl,
            fontFamily: typography.fontFamily.sans.join(", "),
          }}
          className={`w-full ${maxWidthClasses[maxWidth]} overflow-hidden flex flex-col max-h-[90vh]`}
        >
          {/* HEADER */}
          {(title || icon) && (
            <div
              style={{
                padding: spacing.md,
                borderColor: colors.border,
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                backgroundColor: colors.background,
              }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                {icon && (
                  <div
                    style={{
                      padding: spacing.sm,
                      borderRadius: borderRadius.xl,
                      backgroundColor: colors.primaryLight,
                      borderColor: "#FDE68A",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      color: colors.primary,
                    }}
                  >
                    {icon}
                  </div>
                )}
                <div>
                  {typeof title === "string" ? (
                    <h2
                      style={{
                        fontSize: typography.fontSize.xl,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.textPrimary,
                      }}
                      className="tracking-tight"
                    >
                      {title}
                    </h2>
                  ) : (
                    title
                  )}
                  {subtitle && (
                    <p
                      style={{
                        color: colors.textSecondary,
                        fontSize: typography.fontSize.xs,
                      }}
                      className="mt-0.5 font-normal"
                    >
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={onClose}
                style={{
                  borderRadius: borderRadius.xl,
                  backgroundColor: colors.cardSecondary,
                  borderColor: colors.border,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  color: colors.textSecondary,
                  transition: animations.transitionNormal,
                }}
                className="p-2 hover:text-slate-900 hover:bg-slate-200/60"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* BODY */}
          <div className="overflow-y-auto flex-1">{children}</div>

          {/* FOOTER */}
          {footer && (
            <div
              style={{
                padding: spacing.md,
                borderColor: colors.border,
                borderTopWidth: "1px",
                borderTopStyle: "solid",
                backgroundColor: colors.background,
              }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

