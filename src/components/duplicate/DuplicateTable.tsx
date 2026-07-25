import React, { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { DuplicateType, FiltersType } from '@/src/types/duplicate';
import { filterDuplicates, formatCurrency } from '@/src/utils/duplicateUtils';

interface DuplicateTableProps {
  data: DuplicateType[];
  filters: FiltersType;
  onConfirmPayment: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DuplicateTable: React.FC<DuplicateTableProps> = ({
  data,
  filters,
  onConfirmPayment,
  onDelete,
}) => {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredData = filterDuplicates(data, filters);

  const formatDate = (date: string): string => {
    if (!date) return '';
    const [year, month, day] = date.slice(0, 10).split('-');
    if (!year || !month || !day) return '';
    return `${day}/${month}/${year}`;
  };

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
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            {/* HEADER */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Cliente / Fornecedor
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Documento
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Vencimento
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Valor
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">
                  Ações
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                    Nenhuma duplicata encontrada
                  </td>
                </tr>
              )}

              {filteredData.map((dup) => (
                <motion.tr
                  key={dup.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`hover:bg-slate-50/80 transition-colors group ${
                    dup.status === 'delayed' ? 'bg-red-50/50' : ''
                  }`}
                > 
                  {/* CLIENTE */}
                  <td className={`px-6 py-4 ${dup.status === 'delayed' ? 'border-l-4 border-red-500' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 font-black text-xs shadow-xs">
                        {getInitials(dup.client)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{dup.client}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          CNPJ: {dup.cnpj}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* DOCUMENTO */}
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono truncate max-w-[180px]" title={dup.document}>
                    {dup.document}
                  </td>

                  {/* DATA */}
                  <td className={`px-6 py-4 text-sm font-medium ${
                    dup.status === 'delayed'
                      ? 'text-red-600 font-bold'
                      : 'text-slate-700'
                  }`}>
                    {formatDate(dup.due_date)}
                  </td>

                  {/* VALOR */}
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900">
                      {formatCurrency(dup.value)}
                    </p>
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      dup.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : dup.status === 'delayed'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {dup.status === 'pending'
                        ? 'Pendente'
                        : dup.status === 'delayed'
                        ? 'Atrasado'
                        : 'Pago'}
                    </span>
                  </td>

                  {/* AÇÕES */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {dup.status !== 'paid' && (
                        <button
                          type="button"
                          onClick={() => setConfirmId(dup.id)}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-200 cursor-pointer shadow-2xs"
                        >
                          <CheckCircle2 size={13} />
                          <span>Pagar</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDeleteId(dup.id)}
                        className="inline-flex items-center gap-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-red-100 cursor-pointer shadow-2xs"
                      >
                        <Trash2 size={13} />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* CONFIRMATION MODAL */}
          {(confirmId || deleteId) && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 w-[360px] shadow-xl">
                <h2 className="text-slate-900 font-black text-sm mb-2 uppercase tracking-widest">
                  {confirmId ? 'Confirmar Pagamento' : 'Excluir Duplicata'}
                </h2>

                <p className="text-slate-600 text-xs mb-6">
                  {confirmId
                    ? 'Você tem certeza que deseja confirmar o pagamento desta duplicata?'
                    : 'Você tem certeza que deseja excluir esta duplicata do sistema?'}
                </p>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmId(null);
                      setDeleteId(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
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
                        onDelete(deleteId);
                        setDeleteId(null);
                      }
                    }}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg text-white cursor-pointer shadow-sm ${
                      deleteId
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-slate-50/80 flex items-center justify-between border-t border-slate-200">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
            Exibindo <span className="text-slate-900">{filteredData.length}</span> resultados
          </p>

          <div className="flex gap-2">
            <button type="button" className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-400 cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="px-3 py-1 text-xs font-black bg-amber-600 text-white rounded-lg shadow-2xs">
              1
            </button>
            <button type="button" className="p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-400 cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateTable;
