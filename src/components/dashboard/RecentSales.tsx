import React from "react";
import { dashboardTheme } from "../../theme/dashboardTheme";
import { formatCurrency } from "../../hooks/useDashboard";

export interface SaleRecord {
  id: string;
  cliente: string;
  data: string;
  valor: number;
  pagamento: string;
  status: "PAGO" | "PENDENTE" | "CANCELADO" | string;
}

interface RecentSalesProps {
  sales: SaleRecord[];
}

export const RecentSales: React.FC<RecentSalesProps> = ({ sales }) => {
  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PAGO") {
      return (
        <span
          style={{
            backgroundColor: dashboardTheme.successBg,
            color: dashboardTheme.successText,
            borderColor: dashboardTheme.successBorder,
          }}
          className="px-2.5 py-1 rounded-lg border text-[11px] font-extrabold inline-flex items-center gap-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Pago</span>
        </span>
      );
    }
    if (s === "PENDENTE") {
      return (
        <span
          style={{
            backgroundColor: dashboardTheme.warningBg,
            color: dashboardTheme.warningText,
            borderColor: dashboardTheme.warningBorder,
          }}
          className="px-2.5 py-1 rounded-lg border text-[11px] font-extrabold inline-flex items-center gap-1"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
          <span>Pendente</span>
        </span>
      );
    }

    return (
      <span
        style={{
          backgroundColor: dashboardTheme.dangerBg,
          color: dashboardTheme.dangerText,
          borderColor: dashboardTheme.dangerBorder,
        }}
        className="px-2.5 py-1 rounded-lg border text-[11px] font-extrabold inline-flex items-center gap-1"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div
      style={{
        backgroundColor: dashboardTheme.card,
        borderColor: dashboardTheme.border,
      }}
      className="p-6 rounded-2xl border shadow-xs overflow-hidden"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{ color: dashboardTheme.primaryRed }}
              className="material-symbols-outlined text-xl"
            >
              receipt_long
            </span>
            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Últimas Vendas
            </h3>
          </div>
          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-medium mt-0.5"
          >
            Histórico recente de operações no Terminal PDV e faturamento
          </p>
        </div>

        <button
          type="button"
          style={{ color: dashboardTheme.primaryRed }}
          className="text-xs font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Ver todas as vendas</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr
              style={{
                backgroundColor: dashboardTheme.bg,
                borderColor: dashboardTheme.border,
                color: dashboardTheme.textSecondary,
              }}
              className="border-b text-[11px] font-black uppercase tracking-wider"
            >
              <th className="py-3 px-4 rounded-l-xl">Cód. / Cliente</th>
              <th className="py-3 px-4">Data e Hora</th>
              <th className="py-3 px-4">Valor Total</th>
              <th className="py-3 px-4">Pagamento</th>
              <th className="py-3 px-4 text-right rounded-r-xl">Status</th>
            </tr>
          </thead>
          <tbody
            style={{ color: dashboardTheme.textPrimary }}
            className="divide-y divide-slate-100 text-xs font-semibold"
          >
            {sales.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                  Nenhuma venda encontrada para o período selecionado.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          backgroundColor: dashboardTheme.lightRed,
                          color: dashboardTheme.darkRed,
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                      >
                        <span className="material-symbols-outlined text-base">
                          shopping_bag
                        </span>
                      </div>
                      <div>
                        <p
                          style={{ color: dashboardTheme.textPrimary }}
                          className="font-bold truncate max-w-[200px]"
                        >
                          {sale.cliente}
                        </p>
                        <p
                          style={{ color: dashboardTheme.textMuted }}
                          className="text-[10px] font-medium"
                        >
                          {sale.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{ color: dashboardTheme.textSecondary }}
                    className="py-3.5 px-4 whitespace-nowrap"
                  >
                    {sale.data}
                  </td>
                  <td
                    style={{ color: dashboardTheme.textPrimary }}
                    className="py-3.5 px-4 font-black whitespace-nowrap"
                  >
                    {formatCurrency(sale.valor)}
                  </td>
                  <td
                    style={{ color: dashboardTheme.textSecondary }}
                    className="py-3.5 px-4 whitespace-nowrap"
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-[11px]">
                      <span className="material-symbols-outlined text-sm">
                        credit_card
                      </span>
                      <span>{sale.pagamento}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {getStatusBadge(sale.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
