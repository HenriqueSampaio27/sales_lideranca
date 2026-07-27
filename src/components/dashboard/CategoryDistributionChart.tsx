import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { dashboardTheme } from "../../theme/dashboardTheme";
import { PaymentDistributionPoint, formatCurrency } from "../../hooks/useDashboard";

interface CategoryDistributionChartProps {
  data: PaymentDistributionPoint[];
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
        <p className="font-black text-sm" style={{ color: item.color }}>
          {formatCurrency(item.value)}
        </p>
      </div>
    );
  }
  return null;
};

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  data,
}) => {
  const totalVal = data.reduce((acc, curr) => acc + curr.value, 0);

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
              pie_chart
            </span>
            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Formas de Pagamento
            </h3>
          </div>
          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-medium mt-0.5"
          >
            Distribuição do faturamento por método de recebimento
          </p>
        </div>
      </div>

      <div className="w-full h-52 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
            Total
          </span>
          <span
            style={{ color: dashboardTheme.textPrimary }}
            className="text-sm font-black"
          >
            {totalVal >= 1000 ? `R$ ${(totalVal / 1000).toFixed(0)}k` : `R$ ${totalVal.toFixed(0)}`}
          </span>
        </div>
      </div>

      {/* LEGEND */}
      <div className="mt-2 space-y-2">
        {data.map((item) => {
          const pct = totalVal > 0 ? ((item.value / totalVal) * 100).toFixed(1) : "0";
          return (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
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
                <span style={{ color: dashboardTheme.textSecondary }} className="font-medium">
                  {pct}%
                </span>
                <span
                  style={{ color: dashboardTheme.textPrimary }}
                  className="font-black"
                >
                  {formatCurrency(item.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
