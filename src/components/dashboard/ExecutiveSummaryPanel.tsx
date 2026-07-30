import React from "react";
import { dashboardTheme } from "../../theme/dashboardTheme";
import { formatCurrency } from "../../hooks/useDashboard";

interface ExecutiveSummaryProps {
  faturamentoTotal: number;
  lucroEstimado: number;
  margemLucroPct: number;
  pendingInvoicesValue: number;
  duplicatesValue: number;
  totalExpenses: number;
  lowStockCount: number;
  outOfStockCount: number;
  clientesAtivos: number;
}

export const ExecutiveSummaryPanel: React.FC<ExecutiveSummaryProps> = ({
  faturamentoTotal,
  lucroEstimado,
  margemLucroPct,
  pendingInvoicesValue,
  duplicatesValue,
  totalExpenses,
  lowStockCount,
  outOfStockCount,
  clientesAtivos,
}) => {
  const expenseRatio =
    faturamentoTotal > 0 ? ((totalExpenses / faturamentoTotal) * 100).toFixed(1) : "0";

  return (
    <div
      style={{
        backgroundColor: dashboardTheme.card,
        borderColor: dashboardTheme.border,
      }}
      className="p-6 rounded-2xl border shadow-xs relative overflow-hidden"
    >
      {/* DECORATIVE TOP BADGE */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div
            style={{
              backgroundColor: dashboardTheme.primaryRed,
              color: "#FFFFFF",
            }}
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
          </div>
          <div>
            <h3
              style={{ color: dashboardTheme.textPrimary }}
              className="text-base font-black tracking-tight uppercase"
            >
              Resumo Inteligente & Análise Rápida
            </h3>
            <p
              style={{ color: dashboardTheme.textSecondary }}
              className="text-xs font-semibold"
            >
              Diagnóstico automático de desempenho operacional e saúde financeira
            </p>
          </div>
        </div>

        <span
          style={{
            backgroundColor: dashboardTheme.lightRed,
            color: dashboardTheme.darkRed,
            borderColor: dashboardTheme.borderRed,
          }}
          className="px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider hidden sm:inline-block"
        >
          Análise de Execução ERP
        </span>
      </div>

      {/* GRID OF INSIGHT BULLETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* INSIGHT 1: FATURAMENTO & MARGEM */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
          <span className="material-symbols-outlined text-xl text-emerald-600 shrink-0 mt-0.5">
            trending_up
          </span>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">
              Resultado Comercial
            </p>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 leading-relaxed">
              O faturamento atingiu{" "}
              <strong className="font-extrabold text-slate-950">
                {formatCurrency(faturamentoTotal)}
              </strong>
              , gerando um lucro líquido de{" "}
              <strong className="font-extrabold text-emerald-700">
                {formatCurrency(lucroEstimado)}
              </strong>{" "}
              (margem de <strong>{margemLucroPct.toFixed(1)}%</strong>).
            </p>
          </div>
        </div>

        {/* INSIGHT 2: VALORES A RECEBER & DUPLICATAS */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
          <span className="material-symbols-outlined text-xl text-amber-600 shrink-0 mt-0.5">
            account_balance_wallet
          </span>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">
              Contas & Cobranças
            </p>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 leading-relaxed">
              Você possui{" "}
              <strong className="font-extrabold text-amber-700">
                {formatCurrency(pendingInvoicesValue)}
              </strong>{" "}
              em vendas pendentes no balcão e{" "}
              <strong className="font-extrabold text-slate-950">
                {formatCurrency(duplicatesValue)}
              </strong>{" "}
              em duplicatas faturadas a pagar.
            </p>
          </div>
        </div>

        {/* INSIGHT 3: ALERTA DE ESTOQUE */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
          <span className="material-symbols-outlined text-xl text-rose-600 shrink-0 mt-0.5">
            inventory_2
          </span>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">
              Situação do Almoxarifado
            </p>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 leading-relaxed">
              Existem{" "}
              <strong className="font-extrabold text-rose-700">
                {outOfStockCount} produto(s) esgotados
              </strong>{" "}
              e{" "}
              <strong className="font-extrabold text-amber-700">
                {lowStockCount} abaixo do estoque mínimo
              </strong>{" "}
              exigindo reposição.
            </p>
          </div>
        </div>

        {/* INSIGHT 4: DESPESAS vs FATURAMENTO */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
          <span className="material-symbols-outlined text-xl text-red-600 shrink-0 mt-0.5">
            pie_chart
          </span>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase">
              Comprometimento Operacional
            </p>
            <p className="text-xs font-semibold text-slate-900 mt-0.5 leading-relaxed">
              As despesas de{" "}
              <strong className="font-extrabold text-slate-950">
                {formatCurrency(totalExpenses)}
              </strong>{" "}
              representam{" "}
              <strong className="font-extrabold text-red-700">
                {expenseRatio}%
              </strong>{" "}
              da receita bruta acumulada do período.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
