import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Receipt, Printer, AlertTriangle, Calendar, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { ExpensesTable } from '../components/expenses/ExpensesTable';
import { ExpensesModal } from '../components/expenses/ExpensesModal';
import Filters from '../components/commom/Filters';
import {
  ExpenseType,
  ExpenseFiltersType,
} from '../types/expenses';
import { expensesService } from '../services/expensesService';
import {
  calculateTotalExpenses,
  getUpcomingExpenses,
  getExpenseAlerts,
  calculateAlertValue,
  formatCurrency,
  filterExpenses,
} from '../utils/expensesUtils';
import { colors, borderRadius, typography, shadows, animations } from '../theme';

export const Expenses: React.FC = () => {
  // STATES
  const [data, setData] = useState<ExpenseType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<ExpenseFiltersType>({
    status: '',
    category: '',
    date: null,
    mode: 'day',
    search: '',
  });

  // EFFECTS
  const loadExpenses = useCallback(async (): Promise<void> => {
    try {
      const result = await expensesService.getExpenses();
      setData(result || []);
    } catch (err) {
      console.error('Erro ao buscar despesas:', err);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // HANDLERS
  const handleConfirmPayment = useCallback(async (id: string): Promise<void> => {
    try {
      await expensesService.confirmPayment(id);
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'paid' as const } : item
        )
      );
    } catch (err) {
      console.error('Erro ao confirmar pagamento de despesa:', err);
    }
  }, []);

  const handleDeleteExpense = useCallback(async (id: string): Promise<void> => {
    try {
      await expensesService.deleteExpense(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Erro ao deletar despesa:', err);
    }
  }, []);

  const handleCreateExpenseSuccess = useCallback((newExp: ExpenseType): void => {
    setData((prev) => [newExp, ...prev]);
  }, []);

  const handleFilterChange = useCallback((newFilters: ExpenseFiltersType): void => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // DERIVED VALUES (useMemo)

  const filteredData = useMemo(() => {
    return filterExpenses(data, filters)
  },[data, filters])

  const pendingTotal = useMemo(() => {
    return calculateTotalExpenses(filteredData);
  }, [filteredData]);

  const upcomingCount = useMemo(() => {
    return getUpcomingExpenses(data).length;
  }, [data]);

  const alerts = useMemo(() => {
    return getExpenseAlerts(data);
  }, [data]);

  const alertTotal = useMemo(() => {
    return calculateAlertValue(alerts);
  }, [alerts]);

  return (
    <div 
      className="min-h-screen transition-colors"
      style={{ 
        backgroundColor: colors.background, 
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.sans.join(', '),
      }}
    >
      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b pb-8"
          style={{ borderColor: colors.border }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span 
                className="p-2 border shadow-xs"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: borderRadius.xl,
                  color: colors.primary,
                }}
              >
                <Receipt size={20} />
              </span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic mb-2" style={{ color: colors.textPrimary }}>
                Gestão de <span style={{ color: colors.primary }}>Despesas</span>
              </h1>
            </div>
            <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
              Acompanhe, filtre e liquide suas contas e despesas operacionais em tempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* TOTAL PENDENTE */}
            <div 
              className="p-4 border min-w-[170px] transition-all"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: borderRadius['2xl'],
                boxShadow: shadows.sm,
              }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-1 font-black" style={{ color: colors.textSecondary }}>
                Total Pendente
              </p>
              <p className="text-lg font-black" style={{ color: colors.textPrimary }}>
                {formatCurrency(pendingTotal)}
              </p>
            </div>

            {/* VENCIMENTOS PRÓXIMOS */}
            <div 
              className="p-4 border min-w-[170px] transition-all"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: borderRadius['2xl'],
                boxShadow: shadows.sm,
              }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-1 font-black" style={{ color: colors.textSecondary }}>
                Próximos (7 dias)
              </p>
              <p className="text-lg font-black" style={{ color: colors.primary }}>
                {upcomingCount} <span className="text-xs font-normal text-slate-500">contas</span>
              </p>
            </div>

            {/* BOTÃO NOVA DESPESA */}
            <motion.button
              type="button"
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-white font-black px-6 py-4 transition-all uppercase text-xs tracking-widest cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius['2xl'],
                boxShadow: shadows.glowPrimary,
                transition: animations.transitionNormal,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              <Plus size={18} />
              <span>Nova Despesa</span>
            </motion.button>
          </div>
        </motion.header>

        {/* ALERTA DE VENCIMENTO PRÓXIMO / HOJE */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 border flex items-center justify-between gap-4"
            style={{
              backgroundColor: colors.warningLight,
              borderColor: colors.warningBorder,
              borderRadius: borderRadius['2xl'],
              boxShadow: shadows.sm,
            }}
          >
            <div className="flex items-center gap-3">
              <span 
                className="p-2.5 rounded-xl border"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: colors.warningBorder,
                  color: colors.warning,
                }}
              >
                <AlertTriangle size={20} />
              </span>
              <div>
                <p className="text-xs font-bold" style={{ color: colors.textPrimary }}>
                  Atenção: Você possui {alerts.length} despesa(s) vencendo hoje ou já em atraso!
                </p>
                <p className="text-[11px]" style={{ color: colors.textSecondary }}>
                  Total crítico a liquidar: <strong style={{ color: colors.error }}>{formatCurrency(alertTotal)}</strong>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* CONTEÚDO PRINCIPAL: FILTROS + TABELA */}
        <div className="grid grid-cols-12 gap-8">
          <Filters 
            onFilterChange={handleFilterChange} 
            alertCount={alerts.length}
            valueDuplicate={formatCurrency(alertTotal)}
          />

          <ExpensesTable
            data={data}
            filters={filters}
            onConfirmPayment={handleConfirmPayment}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>
      </main>

      {/* FLOATING ACTIONS (PRINT) */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          onClick={() => window.print()}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="border p-3.5 pr-5 flex items-center gap-3 group transition-all cursor-pointer"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: borderRadius.full,
            boxShadow: shadows.lg,
          }}
        >
          <span 
            className="w-10 h-10 flex items-center justify-center text-white transition-all"
            style={{ 
              backgroundColor: colors.primary,
              borderRadius: borderRadius.full,
              boxShadow: shadows.sm,
            }}
          >
            <Printer size={18} />
          </span>
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline-block" style={{ color: colors.textPrimary }}>
            Imprimir Relatório
          </span>
        </motion.button>
      </div>

      {/* MODAL PARA NOVA DESPESA */}
      <ExpensesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateExpenseSuccess}
      />
    </div>
  );
};

export default Expenses;
