import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui";
import { colors, borderRadius, spacing, typography, shadows } from "../../theme";

interface ClientPaginationProps {
  currentPage: number;
  totalClients: number;
  clientsPerPage: number;
  onPageChange: (page: number) => void;
}

const ClientPagination: React.FC<ClientPaginationProps> = ({
  currentPage,
  totalClients,
  clientsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalClients / clientsPerPage) || 1;
  const startItem = totalClients === 0 ? 0 : (currentPage - 1) * clientsPerPage + 1;
  const endItem = Math.min(currentPage * clientsPerPage, totalClients);

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
        <strong style={{ color: colors.textPrimary }}>{totalClients}</strong> clientes
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="xs"
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
          size="xs"
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

export default ClientPagination;
