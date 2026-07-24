import React from "react";
import { PackageX, AlertTriangle, RefreshCw, TrendingDown } from "lucide-react";
import { StatCard } from "../ui";
import { spacing } from "../../theme";

interface StockCardsProps {
  outOfStockSize: number;
  belowMinimumSize: number;
}

const StockCards: React.FC<StockCardsProps> = ({
  outOfStockSize,
  belowMinimumSize,
}) => {
  const stats = [
    {
      label: "Itens em Falta",
      value: outOfStockSize,
      subtext: "Estoque esgotado",
      variant: "error" as const,
      icon: PackageX,
    },
    {
      label: "Reposição Necessária",
      value: belowMinimumSize,
      subtext: "Abaixo do estoque mínimo",
      variant: "warning" as const,
      icon: AlertTriangle,
    },
    {
      label: "Giro de Estoque",
      value: "15.4x",
      subtext: "Média mensal",
      variant: "success" as const,
      icon: RefreshCw,
    },
    {
      label: "Perda/Quebra (Mês)",
      value: "0.4%",
      subtext: "Abaixo da meta (0.8%)",
      variant: "neutral" as const,
      icon: TrendingDown,
    },
  ];

  return (
    <div
      style={{ gap: spacing.md }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          index={i}
          label={stat.label}
          value={stat.value}
          subtext={stat.subtext}
          icon={stat.icon}
          variant={stat.variant}
        />
      ))}
    </div>
  );
};

export default StockCards;

