import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { PlusCircle, Printer } from 'lucide-react';
import { motion } from 'motion/react';

import DuplicateModal from '../components/duplicate/DuplicateModal';
import Filters from '../components/commom/Filters';
import DuplicateTable from '../components/duplicate/DuplicateTable';
import { DuplicateType, FiltersType } from '../types/duplicate';
import { duplicateService } from '../services/duplicateService';
import {
  filterDuplicates,
  calculateTotalValue,
  getUpcomingDuplicates,
  getDuplicateAlerts,
  calculateAlertValue,
  formatCurrency,
} from '../utils/duplicateUtils';
import { colors, borderRadius, typography, shadows, animations } from '../theme';


export const Duplicate: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersType>({
    status: '',
    date: null,
    mode: 'day',
  });
  const [data, setData] = useState<DuplicateType[]>([]);

  const loadDuplicates = useCallback(async (): Promise<void> => {
    try {
      const result = await duplicateService.getDuplicates();
      setData(result || []);
    } catch (err) {
      console.error('Erro ao buscar duplicatas:', err);
    }
  }, []);

  useEffect(() => {
    loadDuplicates();
  }, [loadDuplicates]);

  const handleConfirmPayment = useCallback(async (id: string): Promise<void> => {
    try {
      await duplicateService.confirmPayment(id);
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'paid' as const } : item
        )
      );
    } catch (err) {
      console.error('Erro ao confirmar pagamento:', err);
    }
  }, []);

  const handleDeleteDuplicate = useCallback(async (id: string): Promise<void> => {
    try {
      await duplicateService.deleteDuplicate(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Erro ao deletar duplicata:', error);
    }
  }, []);

  const handleCreateDuplicate = useCallback((newDup: DuplicateType): void => {
    setData((prev) => [...prev, newDup]);
  }, []);

  const handleFilterChange = useCallback((newFilters: FiltersType): void => {
    setFilters(newFilters);
  }, []);

  // Calculated values with useMemo
  const filteredData = useMemo(() => {
    return filterDuplicates(data, filters);
  }, [data, filters]);

  const totalValue = useMemo(() => {
    return calculateTotalValue(filteredData);
  }, [filteredData]);

  const upcomingDue = useMemo(() => {
    return getUpcomingDuplicates(data);
  }, [data]);

  const totalUpcoming = useMemo(() => {
    return upcomingDue.length;
  }, [upcomingDue]);

  const alerts = useMemo(() => {
    return getDuplicateAlerts(data);
  }, [data]);

  const totalAlerts = useMemo(() => {
    return alerts.length;
  }, [alerts]);

  const totalAlertValue = useMemo(() => {
    return calculateAlertValue(alerts);
  }, [alerts]);

  const formattedAlertValue = useMemo(() => {
    return formatCurrency(totalAlertValue);
  }, [totalAlertValue]);

  const formattedTotalValue = useMemo(() => {
    return formatCurrency(totalValue);
  }, [totalValue]);

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b pb-8"
          style={{ borderColor: colors.border }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic mb-2" style={{ color: colors.textPrimary }}>
              Gestão de <span style={{ color: colors.primary }}>Duplicatas</span>
            </h1>
            <p className="font-semibold uppercase tracking-[0.08em] text-xs" style={{ color: colors.textSecondary }}>
              Controle financeiro e monitoramento de vencimentos industriais.
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
              <p className="text-xl font-black" style={{ color: colors.primary }}>
                {formattedTotalValue}
              </p>
            </div>

            {/* VENCIMENTOS */}
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
                Próximos Vencimentos
              </p>
              <p className="text-xl font-black" style={{ color: colors.textPrimary }}>
                {totalUpcoming} <span className="text-xs font-semibold" style={{ color: colors.textSecondary }}>títulos</span>
              </p>
            </div>

            {/* BOTÃO NOVO */}
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
              <PlusCircle size={20} />
              <span>NOVA DUPLICATA</span>
            </motion.button>
          </div>
        </motion.div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-12 gap-8">
          {/* FILTROS */}
          <Filters
            onFilterChange={handleFilterChange}
            alertCount={totalAlerts}
            valueDuplicate={formattedAlertValue}
          />

          {/* TABELA */}
          <DuplicateTable
            data={data}
            filters={filters}
            onConfirmPayment={handleConfirmPayment}
            onDelete={handleDeleteDuplicate}
          />
        </div>
      </main>

      {/* BOTÃO FLUTUANTE */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
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
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: colors.textPrimary }}>
            Gerar Relatório Consolidado
          </span>
        </motion.button>
      </div>

      <DuplicateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateDuplicate}
      />
    </div>
  );
};

export default Duplicate;
