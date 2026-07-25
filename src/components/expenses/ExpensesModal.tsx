import React, { useState } from 'react';
import { X, Tag, FileText, Calendar, DollarSign, Building } from 'lucide-react';
import { motion } from 'motion/react';
import { ExpenseType, ExpenseFormState } from '@/src/types/expenses';
import { expensesService } from '@/src/services/expensesService';
import { colors, borderRadius, typography, shadows, animations } from '@/src/theme';

interface ExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newExpense: ExpenseType) => void;
}

const CATEGORIES = [
  'Operacional',
  'Infraestrutura',
  'Serviços',
  'Marketing',
  'Manutenção',
  'Impostos & Taxas',
  'Outros',
];

export const ExpensesModal: React.FC<ExpensesModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ExpenseFormState>({
    name: '',
    category: 'Operacional',
    document: '',
    due_date: '',
    value: '',
    status: 'pending',
    notes: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Por favor, informe o nome do fornecedor.');
      return;
    }

    if (!formData.due_date) {
      setError('Por favor, selecione a data de vencimento.');
      return;
    }

    const numericValue = parseFloat(formData.value.replace(',', '.'));
    if (isNaN(numericValue) || numericValue <= 0) {
      setError('Por favor, informe um valor numérico válido.');
      return;
    }

    setLoading(true);

    try {
      const created = await expensesService.createExpense({
        name: formData.name,
        category: formData.category,
        document: formData.document || `EXP-${Date.now().toString().slice(-4)}`,
        due_date: formData.due_date,
        value: numericValue,
        status: formData.status,
        notes: formData.notes,
      });

      onSuccess(created);
      onClose();
      setFormData({
        name: '',
        category: 'Operacional',
        document: '',
        due_date: '',
        value: '',
        status: 'pending',
        notes: '',
      });
    } catch (err) {
      console.error('Erro ao cadastrar despesa:', err);
      setError('Ocorreu um erro ao salvar a despesa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4"
      style={{ backgroundColor: colors.overlay }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="p-6 border w-full max-w-lg overflow-y-auto max-h-[90vh]"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius['2xl'],
          boxShadow: shadows.xl,
          fontFamily: typography.fontFamily.sans.join(', '),
        }}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: colors.border }}>
          <h2 className="font-black text-lg" style={{ color: colors.textPrimary }}>
            Nova Despesa
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 transition-colors cursor-pointer"
            style={{ 
              color: colors.textSecondary,
              borderRadius: borderRadius.lg,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.cardSecondary;
              e.currentTarget.style.color = colors.textPrimary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.textSecondary;
            }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div 
            className="p-3 mb-4 text-xs font-bold border"
            style={{
              backgroundColor: colors.errorLight,
              borderColor: colors.errorBorder,
              color: colors.error,
              borderRadius: borderRadius.md,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FORNECEDOR */}
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: colors.textSecondary }}>
              Fornecedor / Beneficiário *
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Energia Elétrica S.A."
                className="w-full pl-10 pr-3 py-2.5 border text-xs outline-none transition-all"
                style={{
                  backgroundColor: colors.cardSecondary,
                  borderColor: colors.border,
                  borderRadius: borderRadius.xl,
                  color: colors.textPrimary,
                  transition: animations.transitionNormal,
                }}
              />
              <Building size={16} className="absolute left-3 top-3" style={{ color: colors.textSecondary }} />
            </div>
          </div>

          {/* CATEGORIA E DOCUMENTO */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                Categoria *
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border text-xs outline-none transition-all cursor-pointer"
                  style={{
                    backgroundColor: colors.cardSecondary,
                    borderColor: colors.border,
                    borderRadius: borderRadius.xl,
                    color: colors.textPrimary,
                    transition: animations.transitionNormal,
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Tag size={16} className="absolute left-3 top-3" style={{ color: colors.textSecondary }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                Documento / NF
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="document"
                  value={formData.document}
                  onChange={handleChange}
                  placeholder="EXP-2026-001"
                  className="w-full pl-10 pr-3 py-2.5 border text-xs outline-none transition-all"
                  style={{
                    backgroundColor: colors.cardSecondary,
                    borderColor: colors.border,
                    borderRadius: borderRadius.xl,
                    color: colors.textPrimary,
                    transition: animations.transitionNormal,
                  }}
                />
                <FileText size={16} className="absolute left-3 top-3" style={{ color: colors.textSecondary }} />
              </div>
            </div>
          </div>

          {/* VENCIMENTO E VALOR */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                Data Vencimento *
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 border text-xs outline-none transition-all"
                  style={{
                    backgroundColor: colors.cardSecondary,
                    borderColor: colors.border,
                    borderRadius: borderRadius.xl,
                    color: colors.textPrimary,
                    transition: animations.transitionNormal,
                  }}
                />
                <Calendar size={16} className="absolute left-3 top-3" style={{ color: colors.textSecondary }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: colors.textSecondary }}>
                Valor (R$) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  placeholder="0,00"
                  className="w-full pl-10 pr-3 py-2.5 border text-xs outline-none transition-all font-mono"
                  style={{
                    backgroundColor: colors.cardSecondary,
                    borderColor: colors.border,
                    borderRadius: borderRadius.xl,
                    color: colors.textPrimary,
                    transition: animations.transitionNormal,
                  }}
                />
                <DollarSign size={16} className="absolute left-3 top-3" style={{ color: colors.textSecondary }} />
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: colors.textSecondary }}>
              Status Inicial
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border text-xs outline-none transition-all cursor-pointer"
              style={{
                backgroundColor: colors.cardSecondary,
                borderColor: colors.border,
                borderRadius: borderRadius.xl,
                color: colors.textPrimary,
                transition: animations.transitionNormal,
              }}
            >
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="delayed">Atrasada</option>
            </select>
          </div>

          {/* OBSERVAÇÕES */}
          <div>
            <label className="block text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: colors.textSecondary }}>
              Observações
            </label>
            <textarea
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleChange}
              placeholder="Detalhes sobre a despesa..."
              className="w-full p-3 border text-xs outline-none transition-all resize-none"
              style={{
                backgroundColor: colors.cardSecondary,
                borderColor: colors.border,
                borderRadius: borderRadius.xl,
                color: colors.textPrimary,
                transition: animations.transitionNormal,
              }}
            />
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold cursor-pointer transition-colors"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => (e.currentTarget.style.color = colors.textPrimary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-white px-5 py-2.5 font-black text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              style={{
                backgroundColor: colors.primary,
                borderRadius: borderRadius.xl,
                boxShadow: shadows.glowPrimary,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            >
              {loading ? 'Salvando...' : 'Cadastrar Despesa'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ExpensesModal;
