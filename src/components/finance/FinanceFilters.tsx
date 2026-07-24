import React from "react";
import { Search, Filter, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { Input, Button } from "../ui";
import { colors, borderRadius, spacing, shadows, typography } from "../../theme";

interface FinanceFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  onRefresh?: () => void;
}

export const FinanceFilters: React.FC<FinanceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  onRefresh,
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
      {/* Busca */}
      <div className="flex-1 min-w-[280px]">
        <Input
          type="text"
          placeholder="Buscar por cliente, documento ou Nº de nota..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {/* Select Status */}
      <div className="w-full md:w-48 relative">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.textPrimary,
            fontSize: typography.fontSize.xs,
            borderRadius: borderRadius.xl,
          }}
          className="w-full border px-3 py-2.5 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-500 appearance-none outline-none cursor-pointer"
        >
          <option value="">Todos os Status</option>
          <option value="avencer">A Vencer</option>
          <option value="vencido">Vencido</option>
          <option value="parcial">Pago Parcial</option>
        </select>
        <Filter className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>

      {/* Input Data */}
      <div className="w-full md:w-48 relative">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            color: colors.textPrimary,
            fontSize: typography.fontSize.xs,
            borderRadius: borderRadius.xl,
          }}
          className="w-full border px-3 py-2.5 rounded-xl text-xs font-medium focus:ring-1 focus:ring-amber-500 outline-none cursor-pointer"
        />
      </div>

      {/* Botão de atualizar / limpar */}
      {onRefresh && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          title="Atualizar lista"
          className="flex items-center gap-2 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Atualizar</span>
        </Button>
      )}
    </div>
  );
};

export default FinanceFilters;
