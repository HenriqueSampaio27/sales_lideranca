import React from "react";
import { Users, UserCheck, TrendingUp } from "lucide-react";
import { StatCard } from "../ui";
import { spacing } from "../../theme";

interface ClientCardsProps {
  totalClients: number;
  activeClients?: number;
  todayClients: string | number;
}

const ClientCards: React.FC<ClientCardsProps> = ({
  totalClients,
  activeClients = totalClients,
  todayClients,
}) => {
  const stats = [
    {
      label: "Total de Clientes",
      value: totalClients,
      subtext: "Base de dados corporativa",
      icon: Users,
      variant: "neutral" as const,
    },
    {
      label: "Clientes Ativos",
      value: activeClients,
      subtext: "Ativos e regulares",
      icon: UserCheck,
      variant: "success" as const,
    },
    {
      label: "Novos Hoje",
      value: todayClients,
      subtext: "Novos cadastros hoje",
      icon: TrendingUp,
      variant: "primary" as const,
    },
  ];

  return (
    <div
      style={{ gap: spacing.md }}
      className="grid grid-cols-1 sm:grid-cols-3"
    >
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          label={stat.label}
          value={stat.value}
          subtext={stat.subtext}
          icon={stat.icon}
          variant={stat.variant}
          index={i}
        />
      ))}
    </div>
  );
};

export default ClientCards;
