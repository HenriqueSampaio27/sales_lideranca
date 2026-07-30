import React from "react";
import { useDashboard, formatCurrency } from "../hooks/useDashboard";
import { dashboardTheme } from "../theme/dashboardTheme";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { KPICard } from "../components/dashboard/KPICard";
import { ExecutiveSummaryPanel } from "../components/dashboard/ExecutiveSummaryPanel";
import { MonthlyFinancialChart } from "../components/dashboard/MonthlyFinancialChart";
import { ProfitEvolutionChart } from "../components/dashboard/ProfitEvolutionChart";
import { FinancialStatusChart } from "../components/dashboard/FinancialStatusChart";
import { StockAnalysisChart } from "../components/dashboard/StockAnalysisChart";
import { AlertsPanel } from "../components/dashboard/AlertsPanel";
import FinancialEvolutionChart from "../components/dashboard/FinancialEvolutionChart";

export const Dashboard: React.FC = () => {
  const {
    period,
    setPeriod,
    loading,
    refreshing,
    error,
    refreshData,
    kpis,
    monthlyFinancialData,
    profitLineData,
    financialStatusData,
    financialEvolution,
    topProductsByStockValue,
    topProductsBySales,
    alerts,
    recentSales,
  } = useDashboard();

  return (
    <div
      style={{
        backgroundColor: dashboardTheme.bg,
        color: dashboardTheme.textPrimary,
      }}
      className="min-h-screen p-6 space-y-8 font-sans select-none"
    >
      {/* ERROR NOTICE IF SERVER DISCONNECTED */}
      {error && (
        <div
          style={{
            backgroundColor: dashboardTheme.warningBg,
            borderColor: dashboardTheme.warningBorder,
            color: dashboardTheme.warningText,
          }}
          className="p-4 rounded-xl border text-xs font-bold flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">info</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={refreshData}
            className="underline font-black cursor-pointer hover:opacity-80"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* HEADER */}
      <DashboardHeader
        period={period}
        onPeriodChange={setPeriod}
        onRefresh={refreshData}
        refreshing={refreshing}
      />

      {/* LOADING SKELETON OR CONTENT */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#DC2626] border-t-transparent animate-spin" />
          <p
            style={{ color: dashboardTheme.textSecondary }}
            className="text-xs font-extrabold uppercase tracking-widest"
          >
            Sincronizando Indicadores ERP...
          </p>
        </div>
      ) : (
        <>
          {/* EXECUTIVE SMART SUMMARY PANEL */}
          <section>
            <ExecutiveSummaryPanel
              faturamentoTotal={kpis.faturamentoTotal}
              lucroEstimado={kpis.lucroReal}
              margemLucroPct={kpis.margemLucroPct}
              pendingInvoicesValue={kpis.pendingInvoicesValue}
              duplicatesValue={kpis.duplicatesValue}
              totalExpenses={kpis.totalExpenses}
              lowStockCount={kpis.lowStockCount}
              outOfStockCount={kpis.outOfStockCount}
              clientesAtivos={kpis.clientesAtivos}
            />
          </section>

          {/* GRUPO 1: VISÃO GERAL */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <span
                style={{ color: dashboardTheme.primaryRed }}
                className="material-symbols-outlined text-xl"
              >
                query_stats
              </span>
              <h2
                style={{ color: dashboardTheme.textPrimary }}
                className="text-sm font-black uppercase tracking-wider"
              >
                Visão Geral do Negócio
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. FATURAMENTO TOTAL */}
              <KPICard
                index={0}
                title="Faturamento Total"
                value={formatCurrency(kpis.faturamentoTotal)}
                changeText={`${kpis.variacaoFaturamento >= 0 ? "+" : ""}${kpis.variacaoFaturamento.toFixed(1)}%`}
                isPositive={kpis.variacaoFaturamento >= 0}
                comparisonText="vs. mês anterior"
                iconName="payments"
                badgeType="primary"
                highlightTag="Receita Bruta"
              />

              {/* 2. LUCRO ESTIMADO */}
              <KPICard
                index={1}
                title="Lucro Estimado"
                value={formatCurrency(kpis.lucroReal)}
                subValue={`Margem Líquida: ${kpis.margemLucroPct.toFixed(1)}%`}
                changeText={`${kpis.variacaoLucro >= 0 ? "+" : ""}${kpis.variacaoLucro.toFixed(1)}%`}
                isPositive={kpis.variacaoLucro >= 0}
                comparisonText="Lucro Líquido"
                iconName="trending_up"
                badgeType="success"
                highlightTag="Líquido"
              />

              {/* 3. TOTAL DE VENDAS */}
              <KPICard
                index={2}
                title="Total de Vendas"
                value={`${kpis.vendasCount} pedidos`}
                changeText={`${kpis.variacaoVendas >= 0 ? "+" : ""}${kpis.variacaoVendas.toFixed(1)}%`}
                isPositive={kpis.variacaoVendas >= 0}
                comparisonText="Comparado aos últimos 30 dias"
                iconName="shopping_bag"
                badgeType="info"
              />

              {/* 4. CLIENTES ATIVOS */}
              <KPICard
                index={3}
                title="Clientes Ativos"
                value={`${kpis.clientesAtivos} clientes`}
                isPositive={true}
                comparisonText="Base de clientes cadastrada"
                iconName="group"
                badgeType="slate"
              />
            </div>
          </section>

          {/* GRUPO 2: FINANCEIRO */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <span
                style={{ color: dashboardTheme.primaryRed }}
                className="material-symbols-outlined text-xl"
              >
                account_balance
              </span>
              <h2
                style={{ color: dashboardTheme.textPrimary }}
                className="text-sm font-black uppercase tracking-wider"
              >
                Gestão Financeira & Cobranças
              </h2>
            </div>

            {/* 4 CARDS FINANCEIROS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 5. CONTAS PENDENTES */}
              <KPICard
                index={4}
                title="Contas Pendentes"
                value={formatCurrency(kpis.pendingInvoicesValue)}
                subValue={`${kpis.pendingInvoicesCount} vendas em aberto`}
                changeText="Aguardando"
                isPositive={null}
                comparisonText="Vendas realizadas não liquidadas"
                iconName="schedule"
                badgeType="warning"
              />

              {/* 6. DUPLICATAS EM ABERTO */}
              <KPICard
                index={5}
                title="Duplicatas em Aberto"
                value={formatCurrency(kpis.duplicatesValue)}
                subValue={`${kpis.duplicatesCount} duplicatas | Próx: ${kpis.nextDuplicateDueDate}`}
                changeText="Faturado"
                isPositive={kpis.duplicatesCount > 0 ? false : true}
                comparisonText="Contas faturadas a receber"
                iconName="request_quote"
                badgeType="danger"
              />

              {/* 7. DESPESAS DO PERÍODO */}
              <KPICard
                index={6}
                title="Despesas do Período"
                value={formatCurrency(kpis.totalExpenses)}
                
                isPositive={true}
                comparisonText="Contas pagas e operacionais"
                iconName="price_check"
                badgeType="slate"
              />

              {/* 8. MARGEM DE LUCRO */}
              <KPICard
                index={7}
                title="Margem de Lucro"
                value={`${kpis.margemLucroPct.toFixed(1)}%`}
                changeText={`${kpis.margemLucroPct >= 0 ? "Saudável" : "Crítico"}`}
                isPositive={true}
                comparisonText="Percentual sobre receita"
                iconName="pie_chart"
                badgeType={kpis.margemLucroPct >= 0 ? "success" : "danger"}
                highlightTag="Rentabilidade"
              />
            </div>

            {/* GRÁFICOS FINANCEIROS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <MonthlyFinancialChart data={monthlyFinancialData} />
              </div>
              <div className="lg:col-span-4">
                <ProfitEvolutionChart data={profitLineData} />
              </div>
              <div className="lg:col-span-3">
                <FinancialStatusChart data={financialStatusData} />
              </div>
            </div>
            <div className="grid grid-cols-0 lg:grid-cols-1 gap-6">
              <FinancialEvolutionChart data={financialEvolution} />
            </div>
          </section>

          {/* GRUPO 3: ESTOQUE */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
              <span
                style={{ color: dashboardTheme.primaryRed }}
                className="material-symbols-outlined text-xl"
              >
                inventory
              </span>
              <h2
                style={{ color: dashboardTheme.textPrimary }}
                className="text-sm font-black uppercase tracking-wider"
              >
                Controle do Almoxarifado & Estoque
              </h2>
            </div>

            {/* 4 CARDS ESTOQUE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 9. VALOR EM ESTOQUE */}
              <KPICard
                index={8}
                title="Valor em Estoque"
                value={formatCurrency(kpis.valorEstoque)}
                changeText="Patrimônio"
                isPositive={true}
                comparisonText="Capital imobilizado em mercadorias"
                iconName="inventory_2"
                badgeType="success"
              />

              {/* 10. PRODUTOS CADASTRADOS */}
              <KPICard
                index={9}
                title="Produtos Cadastrados"
                value={`${kpis.totalProdutos} itens`}
                changeText="Ativos"
                isPositive={true}
                comparisonText="Catálogo total do sistema"
                iconName="format_list_bulleted"
                badgeType="slate"
              />

              {/* 11. ESTOQUE BAIXO */}
              <KPICard
                index={10}
                title="Estoque Baixo"
                value={`${kpis.lowStockCount} itens`}
                changeText={kpis.lowStockCount > 0 ? "Atenção" : "OK"}
                isPositive={kpis.lowStockCount === 0}
                comparisonText="Abaixo do limite mínimo"
                iconName="warning"
                badgeType="warning"
              />

              {/* 12. PRODUTOS ESGOTADOS */}
              <KPICard
                index={11}
                title="Produtos Esgotados"
                value={`${kpis.outOfStockCount} esgotados`}
                changeText={kpis.outOfStockCount > 0 ? "Crítico" : "OK"}
                isPositive={kpis.outOfStockCount === 0}
                comparisonText="Sem saldo no estoque (zero)"
                iconName="production_quantity_limits"
                badgeType={kpis.outOfStockCount > 0 ? "danger" : "success"}
              />
            </div>

            {/* GRÁFICOS DE ESTOQUE */}
            <StockAnalysisChart
              topStockData={topProductsByStockValue}
              topSalesData={topProductsBySales}
            />
          </section>

          {/* SEÇÃO 4: ALERTAS & OPERAÇÕES RECENTES */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/*<RecentSales /*sales={recentSales} />*/}
            </div>
            <div className="lg:col-span-1">
              <AlertsPanel alerts={alerts} />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
