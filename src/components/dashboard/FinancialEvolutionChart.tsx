import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { dashboardTheme } from "../../theme/dashboardTheme";
import { formatCurrency } from "../../hooks/useDashboard";

interface FinancialEvolutionPoint {
  name: string;
  faturamento: number;
  lucro: number;
  pendentes: number;
  totalNotas: number;
}

interface FinancialEvolutionChartProps {
  data: FinancialEvolutionPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const faturamento =
    payload.find((p: any) => p.dataKey === "faturamento")?.value ?? 0;

  const lucro =
    payload.find((p: any) => p.dataKey === "lucro")?.value ?? 0;

  const pendentes =
    payload.find((p: any) => p.dataKey === "pendentes")?.value ?? 0;

  const totalNotas =
    payload.find((p: any) => p.dataKey === "totalNotas")?.value ?? 0;

  return (
    <div
      style={{
        backgroundColor: dashboardTheme.card,
        borderColor: dashboardTheme.border,
      }}
      className="p-3 rounded-xl border shadow-lg text-xs space-y-2"
    >
      <p className="font-bold">{label}</p>

      <p>Faturamento: {formatCurrency(faturamento)}</p>
      <p>Lucro: {formatCurrency(lucro)}</p>
      <p>Pendentes: {formatCurrency(pendentes)}</p>
      <p>Total das Notas: {formatCurrency(totalNotas)}</p>
    </div>
  );
};

const FinancialEvolutionChart: React.FC<FinancialEvolutionChartProps> = ({
  data,
}) => {
  return (
    <div
      style={{
        backgroundColor: dashboardTheme.card,
        borderColor: dashboardTheme.border,
      }}
      className="p-6 rounded-2xl border shadow-xs flex flex-col h-full"
    >
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ color: dashboardTheme.primaryRed }}
              className="material-symbols-outlined text-xl"
            >
              monitoring
            </span>

            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Evolução Financeira
            </h3>
          </div>

          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-medium mt-1"
          >
            Comparativo mensal entre faturamento, lucro líquido, notas pendentes
            e total de notas emitidas.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            <span>Faturamento</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span>Lucro Líquido</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500" />
            <span>Pendentes</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-600" />
            <span>Total das Notas</span>
          </div>
        </div>
      </div>

      <div className="w-full h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={dashboardTheme.chart.grid}
            />

            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                value >= 1000
                  ? `R$ ${(value / 1000).toFixed(0)}k`
                  : `R$ ${value}`
              }
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              dataKey="faturamento"
              stroke="#2563EB"
              strokeWidth={3}
            />

            <Line
              dataKey="lucro"
              stroke="#16A34A"
              strokeWidth={3}
            />

            <Line
              dataKey="pendentes"
              stroke="#F97316"
              strokeWidth={3}
            />

            <Line
              dataKey="totalNotas"
              stroke="#9333EA"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialEvolutionChart;