import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { dashboardTheme } from "../../theme/dashboardTheme";
import { FinancialStatusPoint, formatCurrency } from "../../hooks/useDashboard";

interface FinancialStatusChartProps {
  data: FinancialStatusPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: dashboardTheme.card,
          borderColor: dashboardTheme.border,
          color: dashboardTheme.textPrimary,
        }}
        className="p-3 rounded-xl border shadow-xl text-xs space-y-1"
      >
        <p style={{ color: dashboardTheme.textSecondary }} className="font-bold">
          {item.name}
        </p>
        <p className="font-black text-sm" style={{ color: item.color }}>
          {formatCurrency(item.valor)}
        </p>
      </div>
    );
  }
  return null;
};

export const FinancialStatusChart: React.FC<FinancialStatusChartProps> = ({ data }) => {
  const totalVal = data.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <div
      style={{
        backgroundColor: dashboardTheme.card,
        borderColor: dashboardTheme.border,
      }}
      className="p-6 rounded-2xl border shadow-xs flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ color: dashboardTheme.primaryRed }}
              className="material-symbols-outlined text-xl"
            >
              donut_large
            </span>
            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Status Financeiro
            </h3>
          </div>
          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-medium mt-0.5"
          >
            Distribuição entre Vendas Liquidadas, Pendentes e Atrasadas
          </p>
        </div>
      </div>

      <div className="w-full h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={88}
              paddingAngle={4}
              dataKey="valor"
            >
              {data.map((entry, index) => (
                <Cell key={`status-cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* CENTER LABEL */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            style={{ color: dashboardTheme.textSecondary }}
            className="text-[10px] font-bold uppercase"
          >
            Volume Total
          </span>
          <span
            style={{ color: dashboardTheme.textPrimary }}
            className="text-sm font-black"
          >
            {totalVal >= 1000 ? `R$ ${(totalVal / 1000).toFixed(0)}k` : `R$ ${totalVal.toFixed(0)}`}
          </span>
        </div>
      </div>

      {/* LEGEND TABLE */}
      <div className="mt-2 space-y-2.5 pt-2 border-t border-slate-100">
        {data.map((item) => {
          const pct = totalVal > 0 ? ((item.valor / totalVal) * 100).toFixed(1) : "0";
          return (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-md shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span
                  style={{ color: dashboardTheme.textPrimary }}
                  className="font-bold"
                >
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: dashboardTheme.textSecondary }} className="font-semibold text-[11px]">
                  {pct}%
                </span>
                <span
                  style={{ color: dashboardTheme.textPrimary }}
                  className="font-black"
                >
                  {formatCurrency(item.valor)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
