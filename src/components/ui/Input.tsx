import React, { InputHTMLAttributes, forwardRef } from "react";
import { colors, borderRadius, typography, animations } from "../../theme";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon, error, fullWidth = true, className = "", style, ...props }, ref) => {
    return (
      <div className={`${fullWidth ? "w-full" : ""} relative`}>
        {icon && (
          <div
            style={{ color: colors.textSecondary }}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          >
            {icon}
          </div>
        )}
        <input
          ref={ref}
          style={{
            backgroundColor: colors.card,
            borderColor: error ? colors.error : colors.border,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: borderRadius.xl,
            color: colors.textPrimary,
            fontFamily: typography.fontFamily.sans.join(", "),
            fontSize: typography.fontSize.sm,
            transition: animations.transitionNormal,
            ...style,
          }}
          className={`${
            icon ? "pl-10" : "px-4"
          } pr-4 py-2.5 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-40 disabled:cursor-not-allowed ${
            fullWidth ? "w-full" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <p
            style={{ color: colors.error, fontSize: typography.fontSize.xs }}
            className="mt-1 font-medium"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

