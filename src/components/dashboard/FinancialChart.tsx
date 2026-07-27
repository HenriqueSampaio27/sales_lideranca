import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { dashboardTheme } from "../../theme/dashboardTheme";
import { formatCurrency } from "../../hooks/useDashboard";

interface FinancialChartProps {
  data: { name: string; valor: number; fill: string }[];
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
        className="p-3 rounded-xl border shadow-lg text-xs"
      >
        <p style={{ color: dashboardTheme.textSecondary }} className="font-bold mb-1">
          {item.name}
        </p>
        <p className="font-black text-sm" style={{ color: item.fill }}>
          {formatCurrency(item.valor)}
        </p>
      </div>
    );
  }
  return null;
};

export const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
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
              account_balance_wallet
            </span>
            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Balanço Financeiro
            </h3>
          </div>
          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-medium mt-0.5"
          >
            Comparativo de Recebidos, Pendentes e Despesas
          </p>
        </div>
      </div>

      <div className="w-full h-72 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
            <Bar dataKey="valor" radius={[8, 8, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{ borderColor: dashboardTheme.border }}
        className="mt-4 pt-4 border-t grid grid-cols-3 gap-2 text-center"
      >
        <div>
          <span className="text-[10px] font-bold uppercase text-emerald-700 block">
            Pagas
          </span>
          <span className="text-xs font-black text-slate-800">
            {formatCurrency(data[0]?.valor || 0)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-amber-700 block">
            Pendentes
          </span>
          <span className="text-xs font-black text-slate-800">
            {formatCurrency(data[1]?.valor || 0)}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase text-rose-700 block">
            Despesas
          </span>
          <span className="text-xs font-black text-slate-800">
            {formatCurrency(data[2]?.valor || 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
