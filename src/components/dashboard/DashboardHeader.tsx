import React from "react";
import { dashboardTheme } from "../../theme/dashboardTheme";
import { PeriodFilter } from "../../hooks/useDashboard";

interface DashboardHeaderProps {
  period: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  period,
  onPeriodChange,
  onRefresh,
  refreshing,
}) => {
  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  const periods: { label: string; value: PeriodFilter }[] = [
    { label: "Hoje", value: "today" },
    { label: "7 dias", value: "7d" },
    { label: "30 dias", value: "30d" },
    { label: "6 meses", value: "6m" },
    { label: "Ano", value: "1y" },
  ];

  return (
    <div
      style={{
        backgroundColor: dashboardTheme.card,
        borderColor: dashboardTheme.border,
      }}
      className="p-6 rounded-2xl border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div>
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: dashboardTheme.lightRed,
              color: dashboardTheme.primaryRed,
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0"
          >
            <span className="material-symbols-outlined text-lg">dashboard</span>
          </div>
          <h1
            style={{ color: dashboardTheme.textPrimary }}
            className="text-2xl font-black tracking-tight"
          >
            Dashboard Geral
          </h1>
        </div>
        <p
          style={{ color: dashboardTheme.textSecondary }}
          className="text-xs font-semibold mt-1 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          <span>{formattedDate}</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-600 font-bold">Visão Consolidada ERP</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* PERÍODO SELECTOR */}
        <div
          style={{
            backgroundColor: dashboardTheme.bg,
            borderColor: dashboardTheme.border,
          }}
          className="flex items-center p-1 rounded-xl border space-x-1"
        >
          {periods.map((p) => {
            const isActive = period === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onPeriodChange(p.value)}
                style={{
                  backgroundColor: isActive ? dashboardTheme.primaryRed : "transparent",
                  color: isActive ? "#FFFFFF" : dashboardTheme.textSecondary,
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive ? "shadow-2xs font-extrabold" : "hover:text-[#0F172A]"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* BOTÃO REFRESH */}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          style={{
            backgroundColor: dashboardTheme.card,
            borderColor: dashboardTheme.border,
            color: dashboardTheme.textPrimary,
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold hover:bg-[#F8FAFC] active:scale-95 transition-all cursor-pointer shadow-2xs"
        >
          <span
            className={`material-symbols-outlined text-base text-[#DC2626] ${
              refreshing ? "animate-spin" : ""
            }`}
          >
            refresh
          </span>
          <span>{refreshing ? "Atualizando..." : "Atualizar Dados"}</span>
        </button>
      </div>
    </div>
  );
};
