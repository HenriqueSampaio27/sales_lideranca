import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Barcode } from 'lucide-react';
import { DuplicateType, DuplicateFormState } from '@/src/types/duplicate';
import { duplicateService } from '@/src/services/duplicateService';

interface DuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: DuplicateType) => void;
}

export const DuplicateModal: React.FC<DuplicateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [form, setForm] = useState<DuplicateFormState>({
    client: '',
    cnpj: '',
    document: '',
    dueDate: '',
    value: '',
    status: 'pending',
  });
  const [loading, setLoading] = useState(false);

  function handleBarcode(code: string): void {
    const cleaned = code.replace(/\D/g, '');

    // LINHA DIGITÁVEL
    if (cleaned.length === 47) {
      const value = parseInt(cleaned.slice(-10), 10) / 100;
      const factor = parseInt(cleaned.slice(33, 37), 10);
      const baseDate = new Date(Date.UTC(1997, 9, 7));
      const dueDate = new Date(baseDate);
      dueDate.setUTCDate(baseDate.getUTCDate() + factor);

      setForm((prev) => ({
        ...prev,
        value: value.toString(),
        dueDate: dueDate.toISOString().split('T')[0],
        document: cleaned,
      }));
      return;
    }

    // CÓDIGO DE BARRAS
    if (cleaned.length >= 44) {
      const barcode = cleaned.slice(0, 44);
      const value = parseInt(barcode.slice(9, 19), 10) / 100;
      const factor = parseInt(cleaned.slice(33, 37), 10);

      const baseDate = new Date(Date.UTC(1997, 9, 7));
      const dueDate = new Date(baseDate);
      dueDate.setUTCDate(baseDate.getUTCDate() + factor);

      setForm((prev) => ({
        ...prev,
        value: value.toString(),
        dueDate: dueDate.toISOString().split('T')[0],
        document: barcode,
      }));
      return;
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(): Promise<void> {
    if (!form.client || !form.value || !form.dueDate) {
      alert("Preencha os campos obrigatórios (Cliente, Vencimento e Valor)");
      return;
    }

    setLoading(true);
    try {
      const newDuplicate = await duplicateService.createDuplicate({
        client: form.client,
        cnpj: form.cnpj,
        document: form.document,
        dueDate: form.dueDate,
        value: Number(form.value),
        status: form.status,
      });

      onCreate(newDuplicate);
      onClose();
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert('Ocorreu um erro ao cadastrar a duplicata.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white p-6 rounded-2xl border border-slate-200 w-full max-w-lg shadow-xl"
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-widest">
            Nova Duplicata
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
              Código de Barras / Linha Digitável
            </label>
            <div className="relative">
              <input
                placeholder="Insira o código de barras ou linha digitável"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  if (value.length >= 44) {
                    handleBarcode(value);
                  }
                }}
              />
              <Barcode className="absolute left-3 top-3 text-slate-400" size={16} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                Cliente / Fornecedor *
              </label>
              <input
                name="client"
                placeholder="Razão Social ou Nome"
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                CNPJ
              </label>
              <input
                name="cnpj"
                placeholder="00.000.000/0001-00"
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
              Número do Documento
            </label>
            <input
              name="document"
              placeholder="Ex: 001/2026"
              value={form.document}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                Data de Vencimento *
              </label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                Valor (R$) *
              </label>
              <input
                type="number"
                name="value"
                step="0.01"
                placeholder="0,00"
                value={form.value}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
              Status Inicial
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
            >
              <option value="pending">Pendente</option>
              <option value="delayed">Atrasado</option>
              <option value="paid">Pago</option>
            </select>
          </div>
        </div>

        {/* BOTÕES */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Duplicata'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DuplicateModal;
