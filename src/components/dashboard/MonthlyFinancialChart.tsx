import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { dashboardTheme } from "../../theme/dashboardTheme";
import { formatCurrency } from "../../hooks/useDashboard";
import { FinancialMonthlyPoint } from "@/src/types";

interface MonthlyFinancialChartProps {
  data: FinancialMonthlyPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: dashboardTheme.card,
          borderColor: dashboardTheme.border,
          color: dashboardTheme.textPrimary,
        }}
        className="p-3.5 rounded-xl border shadow-xl text-xs space-y-1"
      >
        <p style={{ color: dashboardTheme.textSecondary }} className="font-extrabold uppercase mb-1.5">
          {label} - Demonstrativo
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span style={{ color: entry.color }} className="font-bold">
              {entry.name}:
            </span>
            <span className="font-black text-slate-900">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const MonthlyFinancialChart: React.FC<MonthlyFinancialChartProps> = ({ data }) => {
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
              style={{ color: dashboardTheme.primaryRed }}
              className="material-symbols-outlined text-xl"
            >
              bar_chart
            </span>
            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Demonstrativo Financeiro Mensal
            </h3>
          </div>
          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-medium mt-0.5"
          >
            Comparativo entre Receita Bruta, Despesas e Lucro Líquido
          </p>
        </div>
      </div>

      <div className="w-full h-80 min-h-[300px]">
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
            <Legend
              wrapperStyle={{ fontSize: "11px", fontWeight: "bold", paddingTop: "10px" }}
              iconType="circle"
            />
            <Bar dataKey="receita" name="Receita" fill="#0F172A" radius={[4, 4, 0, 0]} />
            <Bar dataKey="despesas" name="Despesas" fill="#DC2626" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lucro" name="Lucro Líquido" fill="#16A34A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
