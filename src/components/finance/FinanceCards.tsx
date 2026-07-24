import React from "react";
import { Wallet, Calendar, AlertTriangle, TrendingUp } from "lucide-react";
import { StatCard } from "../ui";
import { formatCurrencyCompact } from "../../utils/financeUtils";
import { spacing, colors, typography, borderRadius } from "../../theme";

interface FinanceCardsProps {
  pendingNotDue: number;
  dueToday: number;
  overdue: number;
  overduePercentage: string | number;
}

export const FinanceCards: React.FC<FinanceCardsProps> = ({
  pendingNotDue,
  dueToday,
  overdue,
  overduePercentage,
}) => {
  return (
    <div
      style={{ gap: spacing.md }}
      className="grid grid-cols-1 sm:grid-cols-3"
    >
      {/* Total Pendente */}
      <StatCard
        label="Total Pendente"
        value={formatCurrencyCompact(pendingNotDue)}
        subtext="A vencer no prazo regular"
        icon={Wallet}
        variant="neutral"
        index={0}
      />

      {/* Vencidas Hoje */}
      <StatCard
        label="Vencidas Hoje"
        value={formatCurrencyCompact(dueToday)}
        subtext="Vencimento na data atual"
        icon={Calendar}
        variant="warning"
        index={1}
      />

      {/* Total em Atraso */}
      <div className="relative">
        <StatCard
          label="Total em Atraso"
          value={formatCurrencyCompact(overdue)}
          icon={AlertTriangle}
          variant="error"
          index={2}
        />
        <div
          style={{
            color: colors.error,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.bold,
            backgroundColor: "#FEF2F2",
            borderRadius: borderRadius.md,
            padding: `${spacing.xs} ${spacing.sm}`,
            marginTop: `-${spacing.xs}`,
          }}
          className="mx-4 mb-2 flex items-center gap-1.5"
        >
          <TrendingUp className="w-3.5 h-3.5 shrink-0" />
          <span>Crítico: {overduePercentage}% do total pendente</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceCards;
