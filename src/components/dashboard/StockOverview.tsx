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
import { StockMovementPoint, formatCurrency } from "../../hooks/useDashboard";

interface StockOverviewProps {
  outOfStockCount: number;
  lowStockCount: number;
  stockValue: number;
  stockMovement: StockMovementPoint[];
}

export const StockOverview: React.FC<StockOverviewProps> = ({
  outOfStockCount,
  lowStockCount,
  stockValue,
  stockMovement,
}) => {
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
              inventory_2
            </span>
            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Visão Geral de Estoque
            </h3>
          </div>
          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-medium mt-0.5"
          >
            Monitoramento de níveis críticos e movimentação semanal
          </p>
        </div>
      </div>

      {/* THREE MINI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* SEM ESTOQUE */}
        <div
          style={{
            backgroundColor: dashboardTheme.dangerBg,
            borderColor: dashboardTheme.dangerBorder,
          }}
          className="p-3.5 rounded-xl border flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-bold uppercase text-rose-800">
              Sem Estoque
            </p>
            <h4 className="text-xl font-black text-rose-950 mt-0.5">
              {outOfStockCount} <span className="text-xs font-bold">itens</span>
            </h4>
          </div>
          <span className="material-symbols-outlined text-2xl text-rose-600">
            block
          </span>
        </div>

        {/* ABAIXO DO MÍNIMO */}
        <div
          style={{
            backgroundColor: dashboardTheme.warningBg,
            borderColor: dashboardTheme.warningBorder,
          }}
          className="p-3.5 rounded-xl border flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-bold uppercase text-amber-800">
              Abaixo Mínimo
            </p>
            <h4 className="text-xl font-black text-amber-950 mt-0.5">
              {lowStockCount} <span className="text-xs font-bold">itens</span>
            </h4>
          </div>
          <span className="material-symbols-outlined text-2xl text-amber-600">
            warning
          </span>
        </div>

        {/* VALOR TOTAL EM ESTOQUE */}
        <div
          style={{
            backgroundColor: dashboardTheme.lightRed,
            borderColor: dashboardTheme.borderRed,
          }}
          className="p-3.5 rounded-xl border flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] font-bold uppercase text-red-800">
              Patrimônio Estoque
            </p>
            <h4 className="text-lg font-black text-red-950 mt-0.5 truncate max-w-[140px]">
              {formatCurrency(stockValue)}
            </h4>
          </div>
          <span className="material-symbols-outlined text-2xl text-red-600">
            point_of_sale
          </span>
        </div>
      </div>

      {/* CHART MOVIMENTAÇÃO DE ESTOQUE */}
      <div>
        <h4
          style={{ color: dashboardTheme.textPrimary }}
          className="text-xs font-extrabold uppercase mb-3 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-sm text-[#DC2626]">
            sync_alt
          </span>
          <span>Movimentação Diária (Entradas x Saídas)</span>
        </h4>

        <div className="w-full h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stockMovement}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={dashboardTheme.chart.grid}
              />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fill: dashboardTheme.textSecondary, fontSize: 11, fontWeight: 700 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: dashboardTheme.textSecondary, fontSize: 11, fontWeight: 700 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: dashboardTheme.card,
                  borderColor: dashboardTheme.border,
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }}
                iconType="circle"
              />
              <Bar
                dataKey="entradas"
                name="Entradas"
                fill="#16A34A"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="saidas"
                name="Saídas"
                fill={dashboardTheme.primaryRed}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
