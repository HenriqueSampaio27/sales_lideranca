import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { baseUrl } from '@/services/AuthService';
import { useState } from 'react';

type Filters = {
  status?: string;
  date?: string | null;
  mode?: 'day' | 'month';
};

type Duplicate = {
  id: string;
  client: string;
  cnpj: string;
  document: string;
  due_date: string;
  value: number;
  status: 'pending' | 'delayed' | 'paid';
  initials: string;
};

type Props = {
  data: Duplicate[];
  filters: Filters;
  onConfirmPayment: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function DuplicateTable({ data, filters, onConfirmPayment, onDelete }: Props) {
  const base = baseUrl
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const toISODate = (date: string | Date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  };

  // 🔎 FILTRO
  const filteredData = data.filter((dup) => {
  const matchesStatus =
    !filters.status || dup.status === filters.status;

  const matchesDate = (() => {
    if (!filters.date) return true;

    const selected = new Date(filters.date);
    const due = new Date(dup.due_date);

    if (filters.mode === 'month') {
      return (
        selected.getMonth() === due.getMonth() &&
        selected.getFullYear() === due.getFullYear()
      );
    }

    return due.toISOString().slice(0, 10) === filters.date;
  })();

  return matchesStatus && matchesDate;
});

  const formatDate = (date: string) => {
    console.log("dueDate vindo do backend:", date);
    if (!date) return '';

    const [year, month, day] = date.slice(0, 10).split('-');

    if (!year || !month || !day) return '';

    return `${day}/${month}/${year}`;
  };

  
  return (
    <div className="col-span-12 lg:col-span-9">
      <div className="bg-surface-dark rounded-2xl border border-border-dark overflow-hidden shadow-sm">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* HEADER */}
            <thead>
              <tr className="bg-black/40 border-b border-border-dark">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                  Cliente / Fornecedor
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                  Documento
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                  Vencimento
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
                  Valor
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 text-right">
                  Ações
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-border-dark">
              
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500 text-sm">
                    Nenhuma duplicata encontrada
                  </td>
                </tr>
              )}

              {filteredData.map((dup) => {

                return (
                  <motion.tr
                    key={dup.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`hover:bg-white/[0.02] transition-colors group ${
                      dup.status === 'delayed' ? 'bg-rose-500/5' : ''
                    }`}
                  >
                    
                    {/* CLIENTE */}
                    <td className={`px-6 py-5 ${dup.status === 'delayed' ? 'border-l-2 border-rose-500' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                          {dup.initials}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{dup.client}</p>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                            CNPJ: {dup.cnpj}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* DOCUMENTO */}
                    <td className="px-6 py-5 text-xs text-slate-400 font-mono">
                      {dup.document}
                    </td>

                    {/* DATA */}
                    <td className={`px-6 py-5 text-sm ${
                      dup.status === 'delayed'
                        ? 'text-rose-500 font-black'
                        : 'text-white'
                    }`}>
                      {formatDate(dup.due_date)}
                    </td>

                    {/* VALOR */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-white">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(dup.value)}
                      </p>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        dup.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : dup.status === 'delayed'
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : 'bg-green-500/10 text-green-500 border-green-500/20'
                      }`}>
                        {dup.status === 'pending'
                          ? 'Pendente'
                          : dup.status === 'delayed'
                          ? 'Atrasado'
                          : 'Pago'}
                      </span>
                    </td>

                    {/* AÇÕES */}
                    <td className="px-6 py-5 text-right">
                      {dup.status !== 'paid' && (
                        <button
                          onClick={() => setConfirmId(dup.id)}
                          className="inline-flex items-center gap-2 bg-white/5 hover:bg-primary hover:text-background-dark text-white/70 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-border-dark group-hover:border-primary/50"
                        >
                          <CheckCircle2 size={14} />
                          <span>Confirmar Pagamento</span>
                        </button>
                      )}
                      <button
                          onClick={() => setDeleteId(dup.id)}
                          className="inline-flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-rose-500/20"
                        >
                          <span>Excluir</span>
                        </button>
                    </td>
                    

                  </motion.tr>
                );
              })}
            </tbody>
          </table>

          {(confirmId || deleteId) && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              
              <div className="bg-surface-dark border border-border-dark rounded-xl p-6 w-[340px] shadow-xl">
                
                <h2 className="text-white font-black text-sm mb-2 uppercase tracking-widest">
                  {confirmId ? 'Confirmar Pagamento' : 'Excluir Duplicata'}
                </h2>

                <p className="text-slate-400 text-xs mb-6">
                  {confirmId
                    ? 'Você tem certeza que deseja confirmar este pagamento?'
                    : 'Você tem certeza que deseja excluir esta duplicata?'}
                </p>

                <div className="flex justify-end gap-2">

                  {/* NÃO */}
                  <button
                    onClick={() => {
                      setConfirmId(null);
                      setDeleteId(null);
                    }}
                    className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white"
                  >
                    Não
                  </button>

                  {/* SIM */}
                  <button
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
                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg text-background-dark ${
                      deleteId
                        ? 'bg-rose-500 hover:bg-rose-600'
                        : 'bg-primary hover:opacity-90'
                    }`}
                  >
                    Sim
                  </button>

                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-black/20 flex items-center justify-between border-t border-border-dark">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
            Exibindo <span className="text-white">{filteredData.length}</span> resultados
          </p>

          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-border-dark hover:bg-white/5 text-slate-500">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 text-xs font-black bg-primary text-background-dark rounded-lg">
              1
            </button>
            <button className="p-2 rounded-lg border border-border-dark hover:bg-white/5 text-slate-500">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

