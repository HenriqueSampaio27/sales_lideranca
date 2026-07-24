import React from "react";
import { Search } from "lucide-react";
import { Input, Button, Badge } from "../ui";
import { StockFilter } from "../../types/stock";
import { colors, borderRadius, spacing, shadows, typography } from "../../theme";

interface StockFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  stockFilter: StockFilter;
  setStockFilter: (filter: StockFilter) => void;
  setCurrentPage: (page: number) => void;
  outOfStockSize: number;
  belowMinimumSize: number;
}

const StockFilters: React.FC<StockFiltersProps> = ({
  search,
  setSearch,
  stockFilter,
  setStockFilter,
  setCurrentPage,
  outOfStockSize,
  belowMinimumSize,
}) => {
  return (
    <div
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: borderRadius["2xl"],
        padding: spacing.md,
        boxShadow: shadows.sm,
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
    >
      {/* Search Input using UI Design System */}
      <div className="flex-1 max-w-md">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          icon={<Search className="w-4 h-4 text-slate-400" />}
          placeholder="Buscar por nome de produto ou código de barras..."
        />
      </div>

      {/* Filter Tabs using UI Design System */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={stockFilter === "all" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setStockFilter("all")}
        >
          Todos
        </Button>

        <Button
          variant={stockFilter === "out" ? "danger" : "secondary"}
          size="sm"
          onClick={() => setStockFilter("out")}
        >
          <span className="flex items-center gap-1.5">
            <span>Zerados</span>
            <Badge
              variant={stockFilter === "out" ? "neutral" : "error"}
              size="sm"
            >
              {outOfStockSize}
            </Badge>
          </span>
        </Button>

        <Button
          variant={stockFilter === "minimum" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setStockFilter("minimum")}
          style={
            stockFilter === "minimum"
              ? {
                  backgroundColor: colors.primary,
                  color: colors.textPrimary,
                  fontWeight: typography.fontWeight.bold,
                }
              : undefined
          }
        >
          <span className="flex items-center gap-1.5">
            <span>Estoque Mínimo</span>
            <Badge
              variant={stockFilter === "minimum" ? "neutral" : "warning"}
              size="sm"
            >
              {belowMinimumSize}
            </Badge>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default StockFilters;

