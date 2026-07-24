import React from "react";
import { colors, borderRadius, typography, spacing, shadows, animations } from "../../theme";

interface ProductPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  indexOfFirst: number;
  indexOfLast: number;
  totalProducts: number;
}

const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  setCurrentPage,
  indexOfFirst,
  indexOfLast,
  totalProducts,
}) => {
  return (
    <div
      style={{
        paddingLeft: spacing.md,
        paddingRight: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <p
        style={{
          color: colors.textSecondary,
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.medium,
        }}
      >
        Exibindo {totalProducts > 0 ? indexOfFirst + 1 : 0} -{" "}
        {Math.min(indexOfLast, totalProducts)} de {totalProducts} produtos
      </p>
      <div className="flex gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: borderRadius.md,
            color: colors.textPrimary,
            boxShadow: shadows.sm,
            transition: animations.transitionNormal,
          }}
          className="px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <button
          style={{
            backgroundColor: colors.primary,
            color: colors.card,
            borderRadius: borderRadius.md,
            boxShadow: shadows.sm,
          }}
          className="px-3 py-1.5 text-xs font-bold"
        >
          {currentPage}
        </button>
        <button
          disabled={indexOfLast >= totalProducts}
          onClick={() => setCurrentPage(currentPage + 1)}
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: borderRadius.md,
            color: colors.textPrimary,
            boxShadow: shadows.sm,
            transition: animations.transitionNormal,
          }}
          className="px-3 py-1.5 text-xs font-semibold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductPagination);

