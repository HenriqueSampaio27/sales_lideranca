import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { dashboardTheme } from "../../theme/dashboardTheme";
import { ChartPoint, formatCurrency } from "../../hooks/useDashboard";

interface SalesChartProps {
  data: ChartPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    return (
      <div
        style={{
          backgroundColor: dashboardTheme.card,
          borderColor: dashboardTheme.border,
          color: dashboardTheme.textPrimary,
        }}
        className="p-3 rounded-xl border shadow-lg text-xs"
      >
        <p style={{ color: dashboardTheme.textSecondary }} className="font-bold mb-1">
          {label}
        </p>
        <p className="font-black text-sm flex items-center gap-1 text-[#DC2626]">
          <span>Vendas:</span>
          <span>{formatCurrency(val)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <div
      style={{
        backgroundColor: dashboardTheme.card,
        borderColor: dashboardTheme.border,
      }}
      className="p-6 rounded-2xl border shadow-xs flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ color: dashboardTheme.primaryRed }}
              className="material-symbols-outlined text-xl"
            >
              show_chart
            </span>
            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Evolução de Vendas
            </h3>
          </div>
          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-medium mt-0.5"
          >
            Faturamento acumulado no período selecionado
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#DC2626] inline-block" />
          <span
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-bold"
          >
            Vendas (R$)
          </span>
        </div>
      </div>

      <div className="w-full h-72 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="salesRedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dashboardTheme.primaryRed} stopOpacity={0.35} />
                <stop offset="95%" stopColor={dashboardTheme.primaryRed} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={dashboardTheme.chart.grid}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: dashboardTheme.textSecondary, fontSize: 11, fontWeight: 700 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: dashboardTheme.textSecondary, fontSize: 11, fontWeight: 700 }}
              tickFormatter={(val) =>
                val >= 1000 ? `R$ ${(val / 1000).toFixed(0)}k` : `R$ ${val}`
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sales"
              stroke={dashboardTheme.primaryRed}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#salesRedGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
