import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui";
import { colors, borderRadius, spacing, typography, shadows } from "../../theme";

interface FinancePaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const FinancePagination: React.FC<FinancePaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

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
        <strong style={{ color: colors.textPrimary }}>{totalItems}</strong> registros
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="md"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
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
          className="px-3 py-1 text-xs"
        >
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="secondary"
          size="md"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Próximo
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default FinancePagination;
