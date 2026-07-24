import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui";
import { colors, borderRadius, spacing, typography, shadows } from "../../theme";

interface StockPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  indexOfFirst: number;
  indexOfLast: number;
  filteredProductsLength: number;
}

const StockPagination: React.FC<StockPaginationProps> = ({
  currentPage,
  setCurrentPage,
  indexOfFirst,
  indexOfLast,
  filteredProductsLength,
}) => {
  const startItem = filteredProductsLength === 0 ? 0 : indexOfFirst + 1;
  const endItem = Math.min(indexOfLast, filteredProductsLength);

  return (
    <div
      style={{
        paddingLeft: spacing.md,
        paddingRight: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.sm,
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderTopWidth: "1px",
        borderTopStyle: "solid",
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs"
    >
      <span
        style={{
          color: colors.textSecondary,
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.medium,
        }}
      >
        Exibindo{" "}
        <strong style={{ color: colors.textPrimary }}>{startItem}</strong> -{" "}
        <strong style={{ color: colors.textPrimary }}>{endItem}</strong> de{" "}
        <strong style={{ color: colors.textPrimary }}>{filteredProductsLength}</strong> produtos
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          icon={<ChevronLeft className="w-4 h-4" />}
        >
          Anterior
        </Button>

        <span
          style={{
            backgroundColor: colors.primary,
            color: colors.textPrimary,
            borderRadius: borderRadius.xl,
            boxShadow: shadows.sm,
            fontWeight: typography.fontWeight.bold,
          }}
          className="px-3.5 py-1.5"
        >
          {currentPage}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={indexOfLast >= filteredProductsLength}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <span className="flex items-center gap-1">
            <span>Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default StockPagination;

