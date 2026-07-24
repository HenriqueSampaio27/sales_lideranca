import React from "react";
import { colors, borderRadius, typography, spacing, shadows, animations } from "../../theme";

interface ProductFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  setCurrentPage: (page: number) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  search,
  setSearch,
  setCurrentPage,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h3
        style={{
          color: colors.textPrimary,
          fontFamily: typography.fontFamily.sans.join(", "),
          fontWeight: typography.fontWeight.bold,
          fontSize: typography.fontSize.lg,
        }}
        className="tracking-tight"
      >
        Produtos Existentes
      </h3>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-80">
          <input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: borderRadius.xl,
              color: colors.textPrimary,
              fontFamily: typography.fontFamily.sans.join(", "),
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.medium,
              transition: animations.transitionNormal,
            }}
            className="w-full pl-10 pr-4 py-2 placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            placeholder="Buscar por nome ou código..."
            type="text"
          />
          <span
            style={{ color: colors.textSecondary }}
            className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg pointer-events-none"
          >
            search
          </span>
        </div>
        <button
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: borderRadius.xl,
            color: colors.textSecondary,
            boxShadow: shadows.sm,
            transition: animations.transitionNormal,
            padding: spacing.sm,
          }}
          className="hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-lg">
            filter_list
          </span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(ProductFilters);

