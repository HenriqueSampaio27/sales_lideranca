import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { dashboardTheme } from "../../theme/dashboardTheme";
import {
  TopProductStockPoint,
  TopProductSalesPoint,
  formatCurrency,
} from "../../hooks/useDashboard";

interface StockAnalysisChartProps {
  topStockData: TopProductStockPoint[];
  topSalesData: TopProductSalesPoint[];
}

const CustomTooltipStock = ({ active, payload }: any) => {
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
        <p className="font-extrabold text-slate-900">{item.name}</p>
        <p className="font-bold text-red-700">
          Capital Parado: {formatCurrency(item.valorTotal)}
        </p>
        <p className="text-slate-600">
          Quantidade em estoque: <strong>{item.quantidade} un.</strong>
        </p>
      </div>
    );
  }
  return null;
};

const CustomTooltipSales = ({ active, payload }: any) => {
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
        <p className="font-extrabold text-slate-900">{item.name}</p>
        <p className="font-bold text-emerald-700">
          Volume Comercializado: {item.vendas} unidades
        </p>
      </div>
    );
  }
  return null;
};

export const StockAnalysisChart: React.FC<StockAnalysisChartProps> = ({
  topStockData,
  topSalesData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* CARD 1: TOP VALOR PARADO */}
      <div
        style={{
          backgroundColor: dashboardTheme.card,
          borderColor: dashboardTheme.border,
        }}
        className="p-6 rounded-2xl border shadow-xs flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
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
                Top 5 - Maior Valor Parado (R$)
              </h3>
            </div>
            <p
              style={{ color: dashboardTheme.textSecondary }}
              className="text-xs font-medium mt-0.5"
            >
              Produtos que concentram o maior saldo financeiro em estoque
            </p>
          </div>
        </div>

        <div className="w-full h-64 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topStockData}
              margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }}
                tickFormatter={(val) =>
                  val >= 1000 ? `R$ ${(val / 1000).toFixed(0)}k` : `R$ ${val}`
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={120}
                tick={{ fill: "#0F172A", fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip content={<CustomTooltipStock />} />
              <Bar dataKey="valorTotal" name="Valor (R$)" fill="#DC2626" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARD 2: PRODUTOS COM MAIOR SAÍDA / GIRO */}
      <div
        style={{
          backgroundColor: dashboardTheme.card,
          borderColor: dashboardTheme.border,
        }}
        className="p-6 rounded-2xl border shadow-xs flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                style={{ color: "#16A34A" }}
                className="material-symbols-outlined text-xl"
              >
                local_shipping
              </span>
              <h3
                style={{ color: dashboardTheme.textPrimary }}
                className="text-base font-black tracking-tight uppercase"
              >
                Top 5 - Produtos Mais Vendidos (Giro)
              </h3>
            </div>
            <p
              style={{ color: dashboardTheme.textSecondary }}
              className="text-xs font-medium mt-0.5"
            >
              Itens de maior saída física no almoxarifado
            </p>
          </div>
        </div>

        <div className="w-full h-64 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={topSalesData}
              margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 10, fontWeight: 700 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={120}
                tick={{ fill: "#0F172A", fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip content={<CustomTooltipSales />} />
              <Bar dataKey="vendas" name="Vendas" fill="#0F172A" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
