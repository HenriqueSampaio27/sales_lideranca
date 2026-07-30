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
import { formatCurrency } from "../../hooks/useDashboard";
import { ProfitLinePoint } from "@/src/types";

interface ProfitEvolutionChartProps {
  data: ProfitLinePoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
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
        <p style={{ color: dashboardTheme.textSecondary }} className="font-extrabold uppercase">
          {label} - Lucro Estimado
        </p>
        <p className="font-black text-sm text-emerald-700 flex items-center gap-1">
          <span>Lucro Líquido:</span>
          <span>{formatCurrency(item.lucro)}</span>
        </p>
        <p className="text-slate-600 font-bold">
          Margem de Lucro: <strong className="text-slate-900">{item.margemPct}%</strong>
        </p>
      </div>
    );
  }
  return null;
};

export const ProfitEvolutionChart: React.FC<ProfitEvolutionChartProps> = ({ data }) => {
  return (
    <div
      style={{
        backgroundColor: dashboardTheme.card,
        borderColor: dashboardTheme.border,
      }}
      className="p-6 rounded-2xl border shadow-xs flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ color: "#16A34A" }}
              className="material-symbols-outlined text-xl"
            >
              trending_up
            </span>
            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Evolução do Lucro Estimado
            </h3>
          </div>
          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-medium mt-0.5"
          >
            Trajetória do resultado líquido do negócio ao longo dos meses
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>Lucro Realizado</span>
        </div>
      </div>

      <div className="w-full h-80 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="profitGreenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
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
              dataKey="lucro"
              stroke="#16A34A"
              strokeWidth={3.5}
              fillOpacity={1}
              fill="url(#profitGreenGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
