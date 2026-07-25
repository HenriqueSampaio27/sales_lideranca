import React, { useState } from 'react';
import { CheckCircle2, Trash2, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { ExpenseType, ExpenseFiltersType } from '@/src/types/expenses';
import { filterExpenses, formatCurrency, formatDate } from '@/src/utils/expensesUtils';
import { colors, borderRadius, typography, shadows, animations } from '@/src/theme';

interface ExpensesTableProps {
  data: ExpenseType[];
  filters: ExpenseFiltersType;
  onConfirmPayment: (id: string) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({
  data,
  filters,
  onConfirmPayment,
  onDeleteExpense,
}) => {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredData = filterExpenses(data, filters);

  function getInitials(name: string) {
    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (
      parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase();
  }
  
  return (
    <div className="col-span-12 lg:col-span-9">
      <div 
        className="border overflow-hidden transition-all"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius['2xl'],
          boxShadow: shadows.sm,
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr 
                className="border-b text-[10px] font-black uppercase tracking-wider"
                style={{
                  backgroundColor: colors.cardSecondary,
                  borderColor: colors.border,
                  color: colors.textSecondary,
                }}
              >
                <th className="px-6 py-4">Fornecedor</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Valor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y" style={{ borderColor: colors.border }}>
              {filteredData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={7} 
                    className="px-6 py-12 text-center text-xs font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    Nenhuma despesa encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredData.map((exp) => {
                  const itemDueDate = exp.due_date || '';

                  return (
                    <motion.tr
                      key={exp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="transition-colors group"
                      style={{
                        backgroundColor: exp.status === 'delayed' ? colors.errorLight : colors.card,
                      }}
                      onMouseEnter={(e) => {
                        if (exp.status !== 'delayed') {
                          e.currentTarget.style.backgroundColor = colors.cardSecondary;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (exp.status !== 'delayed') {
                          e.currentTarget.style.backgroundColor = colors.card;
                        }
                      }}
                    >
                      {/* FORNECEDOR */}
                      <td 
                        className="px-6 py-4"
                        style={{
                          borderLeftWidth: exp.status === 'delayed' ? '4px' : '0px',
                          borderLeftStyle: 'solid',
                          borderLeftColor: colors.error,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 flex items-center justify-center font-black text-xs"
                            style={{
                              backgroundColor: colors.primaryLight,
                              color: colors.primaryHover,
                              borderRadius: borderRadius.xl,
                              boxShadow: shadows.sm,
                            }}
                          >
                            {getInitials(exp.name)}
                          </div>

                          <div>
                            <p className="font-bold text-sm leading-tight" style={{ color: colors.textPrimary }}>
                              {exp.name}
                            </p>
                            {exp.notes && (
                              <p className="text-[11px] truncate max-w-[200px]" style={{ color: colors.textSecondary }}>
                                {exp.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CATEGORIA */}
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold border"
                          style={{
                            backgroundColor: colors.cardSecondary,
                            borderColor: colors.border,
                            borderRadius: borderRadius.md,
                            color: colors.textPrimary,
                          }}
                        >
                          <Tag size={12} style={{ color: colors.primary }} />
                          {exp.category}
                        </span>
                      </td>

                      {/* DATA VENCIMENTO */}
                      <td 
                        className="px-6 py-4 text-sm"
                        style={{
                          color: exp.status === 'delayed' ? colors.error : colors.textPrimary,
                          fontWeight: exp.status === 'delayed' ? typography.fontWeight.bold : typography.fontWeight.medium,
                        }}
                      >
                        {formatDate(itemDueDate)}
                      </td>

                      {/* VALOR */}
                      <td className="px-6 py-4 text-sm font-black" style={{ color: colors.textPrimary }}>
                        {formatCurrency(exp.value)}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border"
                          style={{
                            borderRadius: borderRadius.full,
                            ...(exp.status === 'pending'
                              ? {
                                  backgroundColor: colors.warningLight,
                                  color: colors.primaryHover,
                                  borderColor: colors.warningBorder,
                                }
                              : exp.status === 'delayed'
                              ? {
                                  backgroundColor: colors.errorLight,
                                  color: colors.error,
                                  borderColor: colors.errorBorder,
                                }
                              : {
                                  backgroundColor: colors.successLight,
                                  color: colors.success,
                                  borderColor: colors.successBorder,
                                }),
                          }}
                        >
                          {exp.status === 'pending'
                            ? 'Pendente'
                            : exp.status === 'delayed'
                            ? 'Atrasada'
                            : 'Pago'}
                        </span>
                      </td>

                      {/* AÇÕES */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {exp.status !== 'paid' && (
                            <button
                              type="button"
                              onClick={() => (exp.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border cursor-pointer"
                              style={{
                                backgroundColor: colors.cardSecondary,
                                borderColor: colors.border,
                                color: colors.textPrimary,
                                borderRadius: borderRadius.md,
                                transition: animations.transitionFast,
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = colors.primary;
                                e.currentTarget.style.color = '#FFFFFF';
                                e.currentTarget.style.borderColor = colors.primary;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = colors.cardSecondary;
                                e.currentTarget.style.color = colors.textPrimary;
                                e.currentTarget.style.borderColor = colors.border;
                              }}
                            >
                              <CheckCircle2 size={13} />
                              <span>Pagar</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeleteId(exp.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border cursor-pointer"
                            style={{
                              backgroundColor: colors.errorLight,
                              borderColor: colors.errorBorder,
                              color: colors.error,
                              borderRadius: borderRadius.md,
                              transition: animations.transitionFast,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = colors.error;
                              e.currentTarget.style.color = '#FFFFFF';
                              e.currentTarget.style.borderColor = colors.error;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = colors.errorLight;
                              e.currentTarget.style.color = colors.error;
                              e.currentTarget.style.borderColor = colors.errorBorder;
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* CONFIRMATION MODAL */}
          {(confirmId || deleteId) && (
            <div 
              className="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50 p-4"
              style={{ backgroundColor: colors.overlay }}
            >
              <div 
                className="border p-6 w-full max-w-sm"
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: borderRadius['2xl'],
                  boxShadow: shadows.xl,
                  fontFamily: typography.fontFamily.sans.join(', '),
                }}
              >
                <h2 
                  className="font-black text-lg mb-2"
                  style={{ color: colors.textPrimary }}
                >
                  {confirmId ? 'Confirmar Pagamento' : 'Excluir Despesa'}
                </h2>

                <p className="text-xs mb-6 font-medium" style={{ color: colors.textSecondary }}>
                  {confirmId
                    ? 'Você tem certeza que deseja confirmar o pagamento desta despesa?'
                    : 'Você tem certeza que deseja excluir esta despesa do sistema?'}
                </p>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmId(null);
                      setDeleteId(null);
                    }}
                    className="px-4 py-2 text-xs font-bold cursor-pointer transition-colors"
                    style={{ color: colors.textSecondary }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = colors.textPrimary)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirmId) {
                        onConfirmPayment(confirmId);
                        setConfirmId(null);
                      }
                      if (deleteId) {
                        onDeleteExpense(deleteId);
                        setDeleteId(null);
                      }
                    }}
                    className="px-4 py-2 text-xs font-black uppercase tracking-widest text-white cursor-pointer transition-all active:scale-95"
                    style={{
                      backgroundColor: deleteId ? colors.error : colors.primary,
                      borderRadius: borderRadius.md,
                      boxShadow: shadows.sm,
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PAGINATION / FOOTER */}
        <div 
          className="p-4 border-t flex items-center justify-between"
          style={{
            backgroundColor: colors.cardSecondary,
            borderColor: colors.border,
          }}
        >
          <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
            Exibindo <strong style={{ color: colors.textPrimary }}>{filteredData.length}</strong> de{' '}
            <strong style={{ color: colors.textPrimary }}>{data.length}</strong> despesas
          </span>

          <div className="flex gap-2">
            <button 
              type="button" 
              className="p-2 border transition-colors cursor-pointer"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                color: colors.textSecondary,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.borderHover)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.border)}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              type="button" 
              className="px-3 py-1 text-xs font-black text-white"
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.md,
                boxShadow: shadows.sm,
              }}
            >
              1
            </button>
            <button 
              type="button" 
              className="p-2 border transition-colors cursor-pointer"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                color: colors.textSecondary,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = colors.borderHover)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = colors.border)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesTable;
