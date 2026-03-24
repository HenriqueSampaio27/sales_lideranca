import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Duplicate } from '../types';
import { motion } from 'motion/react';

const duplicates: Duplicate[] = [
  {
    id: '1',
    client: 'Ambev Logística S.A.',
    cnpj: '07.526.557/0001-00',
    document: 'DUP-99201',
    dueDate: '15 Out 2023',
    value: 4500.00,
    status: 'pending',
    initials: 'AL'
  },
  {
    id: '2',
    client: 'Cimentos Sobral Ltda',
    cnpj: '12.384.212/0001-88',
    document: 'DUP-99188',
    dueDate: '08 Out 2023',
    value: 1820.50,
    status: 'delayed',
    initials: 'CS'
  },
  {
    id: '3',
    client: 'TransCargas Norte',
    cnpj: '44.111.092/0001-11',
    document: 'DUP-99225',
    dueDate: '22 Out 2023',
    value: 9099.50,
    status: 'pending',
    initials: 'TC'
  },
  {
    id: '4',
    client: 'Metalúrgica AçoForte',
    cnpj: '10.992.887/0004-22',
    document: 'DUP-99230',
    dueDate: '25 Out 2023',
    value: 1500.00,
    status: 'pending',
    initials: 'MA'
  }
];

export default function DuplicateTable() {
  return (
    <div className="col-span-12 lg:col-span-9">
      <div className="bg-brand-surface rounded-xl border border-white/5 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface-variant">Cliente / Fornecedor</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface-variant">Documento</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface-variant">Vencimento</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface-variant">Valor</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface-variant text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface-variant text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {duplicates.map((dup) => (
                <motion.tr 
                  key={dup.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`hover:bg-white/[0.02] transition-colors group ${dup.status === 'delayed' ? 'bg-brand-error-container/5' : ''}`}
                >
                  <td className={`px-6 py-5 ${dup.status === 'delayed' ? 'border-l-2 border-brand-error' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs">
                        {dup.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-on-bg">{dup.client}</p>
                        <p className="text-[10px] text-white/40 uppercase">CNPJ: {dup.cnpj}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-brand-on-surface-variant font-mono">{dup.document}</td>
                  <td className={`px-6 py-5 text-sm ${dup.status === 'delayed' ? 'text-brand-error font-bold' : 'text-brand-on-bg'}`}>
                    {dup.dueDate}
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-brand-on-bg">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dup.value)}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      dup.status === 'pending' 
                        ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' 
                        : 'bg-brand-error/10 text-brand-error border-brand-error/20'
                    }`}>
                      {dup.status === 'pending' ? 'Pendente' : 'Atrasado'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="inline-flex items-center gap-2 bg-white/5 hover:bg-brand-primary hover:text-brand-bg text-white/70 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 border border-white/10 group-hover:border-brand-primary/50">
                      <CheckCircle2 size={14} />
                      <span>Confirmar Pagamento</span>
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-white/5 flex items-center justify-between border-t border-white/5">
          <p className="text-xs text-brand-on-surface-variant">
            Exibindo <span className="text-brand-on-bg font-bold">4</span> de <span className="text-brand-on-bg font-bold">42</span> duplicatas encontradas
          </p>
          <div className="flex gap-2">
            <button className="p-2 rounded border border-white/10 hover:bg-white/5 text-white/50 transition-colors active:scale-90">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 text-xs font-bold bg-brand-primary text-brand-bg rounded shadow-sm">1</button>
            <button className="px-3 py-1 text-xs font-bold text-white/70 hover:bg-white/5 rounded transition-colors">2</button>
            <button className="px-3 py-1 text-xs font-bold text-white/70 hover:bg-white/5 rounded transition-colors">3</button>
            <button className="p-2 rounded border border-white/10 hover:bg-white/5 text-white/50 transition-colors active:scale-90">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
