import { useEffect, useState } from 'react';
import { PlusCircle, Printer } from 'lucide-react';
import { motion } from 'motion/react';

import DuplicateModal from '../components/DuplicateModal';
import Filters from '../components/Filters';
import { baseUrl } from '@/services/AuthService';
import DuplicateTable from '../components/DuplicateTable';

// 🔹 TIPOS
type FiltersType = {
  status?: string;
  date?: string | null;
  mode?: 'day' | 'month';
};

type DuplicateType = {
  id: string;
  client: string;
  cnpj: string;
  document: string;
  due_date: string;
  value: number;
  status: 'pending' | 'delayed' | 'paid';
  initials: string;
};

export default function Duplicate() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const base = baseUrl
  // 🔹 ESTADO DOS FILTROS
  const [filters, setFilters] = useState<FiltersType>({
    status: '',
    date: null
  });
  const [data, setData] = useState([]);

  async function handleConfirmPayment(id: string) {
    try {
      const res = await fetch(`${base}/duplicates/${id}/pay`, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error('Erro ao atualizar');

      setData((prev: DuplicateType[]) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: 'paid' }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteDuplicate(id: string) {
    try {
      const res = await fetch(`${base}/duplicates/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erro ao deletar');

      setData((prev: DuplicateType[]) =>
        prev.filter((item) => item.id !== id)
      );

    } catch (error) {
      console.error('Erro ao deletar duplicata:', error);
    }
  }

  useEffect(() => {
    async function load() {
      const res = await fetch(`${base}/duplicates`);
      const data = await res.json();
      setData(data);
    }

    load();
  }, []);

  const toNumber = (value: any) => {
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  };

  const filteredData = data.filter((item: DuplicateType) => {
    const matchesStatus =
      !filters.status || item.status === filters.status;

    const matchesDate = (() => {
      if (!filters.date) return true;

      const selected = new Date(filters.date);
      const due = new Date(item.due_date);

      if (filters.mode === 'month') {
        return (
          selected.getMonth() === due.getMonth() &&
          selected.getFullYear() === due.getFullYear()
        );
      }

      // modo dia (default)
      return due.toISOString().slice(0, 10) === filters.date;
    })();

    return matchesStatus && matchesDate;
  });

  const totalValue = filteredData
  //.filter(
  //  (item: DuplicateType) =>
  //    item.status === 'pending' || item.status === 'delayed'
  //)
  .reduce((acc, item) => acc + toNumber(item.value), 0);

  const today = new Date();

  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  const upcomingDue = data.filter((item: DuplicateType) => {
  const due = new Date(item.due_date);

  return due >= today && due <= next7Days;
  });

  const totalUpcoming = upcomingDue.length;

  const alerts = data.filter((item: DuplicateType) => {
    const due = new Date(item.due_date);

    const now = new Date();

    const start = new Date();
    start.setHours(0, 0, 0, 0); // início do dia

    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const isPendingOrDelayed =
      item.status === 'pending' || item.status === 'delayed';

    return (
      isPendingOrDelayed &&
      due.getTime() >= start.getTime() &&
      due.getTime() <= end.getTime()
    );
  });
  const totalAlerts = alerts.length;

  const totalAlertValue = alerts.reduce((acc, item) => {
    return acc + Number(item.value);
  }, 0);
  const formattedAlertValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalAlertValue);

  return (
    <div className="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-background-dark">
      
      <main className="p-8 max-w-7xl mx-auto">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-border-dark pb-8"
        >
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-2">
              Gestão de <span className="text-primary">Duplicatas</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium uppercase tracking-[0.1em] text-xs">
              Controle financeiro e monitoramento de vencimentos industriais.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            
            {/* TOTAL PENDENTE */}
            <div className="bg-surface-dark p-4 rounded-xl border border-border-dark min-w-[180px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-black">
                Total Pendente
              </p>
              <p className="text-xl font-black text-primary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(totalValue)}
              </p>
            </div>
            
            {/* VENCIMENTOS */}
            <div className="bg-surface-dark p-4 rounded-xl border border-border-dark min-w-[180px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 font-black">
                Próximos Vencimentos
              </p>
              <p className="text-xl font-black text-white">
                {totalUpcoming} <span className="text-sm font-medium text-slate-500">títulos</span>
              </p>
            </div>
            
            {/* BOTÃO NOVO */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-primary text-background-dark font-black px-6 py-4 rounded-xl shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all uppercase text-xs tracking-widest"
            >
              <PlusCircle size={20} />
              <span>NOVA DUPLICATA</span>
            </motion.button>
          </div>
        </motion.div>

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-12 gap-8">
          
          {/* FILTROS */}
          <Filters onFilterChange={setFilters} alertCount={totalAlerts} valueDuplicate={formattedAlertValue}/>

          {/* TABELA */}
          <DuplicateTable data={data} filters={filters} onConfirmPayment={handleConfirmPayment} onDelete={handleDeleteDuplicate}/>
        
        </div>
      </main>

      {/* BOTÃO FLUTUANTE */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="bg-surface-dark/80 backdrop-blur-md border border-border-dark p-4 rounded-full shadow-2xl flex items-center gap-3 group hover:border-primary/50 transition-all"
        >
          <span className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-background-dark shadow-lg group-hover:shadow-primary/30 transition-all">
            <Printer size={20} />
          </span>
          <span className="text-xs font-black text-white/90 pr-2 uppercase tracking-widest">
            Gerar Relatório Consolidado
          </span>
        </motion.button>
      </div>
      <DuplicateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(newDup) => setData((prev) => [...prev, newDup])}
      />
    </div>
  );
}
