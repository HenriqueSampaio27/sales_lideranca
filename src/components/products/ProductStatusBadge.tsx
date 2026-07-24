import React from "react";
import { colors, borderRadius, typography } from "../../theme";

interface ProductStatusBadgeProps {
  active: boolean;
  onToggle?: () => void;
}

const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({
  active,
  onToggle,
}) => {
  if (active) {
    return (
      <span
        onClick={onToggle}
        style={{
          backgroundColor: "#F0FDF4",
          color: colors.success,
          borderColor: "#BBF7D0",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: borderRadius.full,
          fontFamily: typography.fontFamily.sans.join(", "),
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold ${
          onToggle ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
        }`}
      >
        <span
          style={{ backgroundColor: colors.success }}
          className="size-1.5 rounded-full"
        ></span>
        ATIVO
      </span>
    );
  }

  return (
    <span
      onClick={onToggle}
      style={{
        backgroundColor: "#FEF2F2",
        color: colors.error,
        borderColor: "#FECACA",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: borderRadius.full,
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold ${
        onToggle ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
      }`}
    >
      <span
        style={{ backgroundColor: colors.error }}
        className="size-1.5 rounded-full"
      ></span>
      DESATIVADO
    </span>
  );
};

export default React.memo(ProductStatusBadge);

