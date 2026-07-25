import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Calendar from './Calendar';
import { FiltersType, FilterMode } from '@/src/types/duplicate';

interface FiltersProps {
  onFilterChange: (filters: FiltersType) => void;
  alertCount: number;
  valueDuplicate: string;
}

export const Filters: React.FC<FiltersProps> = ({
  onFilterChange,
  alertCount,
  valueDuplicate,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [mode, setMode] = useState<FilterMode>('day');

  useEffect(() => {
    onFilterChange({
      date: selectedDate,
      status: status,
      mode: mode,
    });
  }, [selectedDate, status, mode, onFilterChange]);

  return (
    <div className="col-span-12 lg:col-span-3 space-y-6">
      {/* CARD DE FILTROS */}
      <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMode('day')}
            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-colors ${
              mode === 'day'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Dia
          </button>

          <button
            type="button"
            onClick={() => setMode('month')}
            className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-colors ${
              mode === 'month'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Mês
          </button>
        </div>

        {/* CALENDÁRIO */}
        <Calendar onSelectDate={setSelectedDate} />

        {/* FILTROS */}
        <div className="mt-6 space-y-4">
          {/* STATUS */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2 font-black">
              Status
            </label>

            <select
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold p-3 text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none cursor-pointer"
            >
              <option value="">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="delayed">Atrasado</option>
              <option value="paid">Pago</option>
            </select>
          </div>

          {/* LIMPAR FILTROS */}
          <button
            type="button"
            onClick={() => {
              setSelectedDate(null);
              setStatus('');
              setMode('day');
            }}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-200 active:scale-95 cursor-pointer"
          >
            Limpar Filtros
          </button>
        </div>
      </section>

    </div>
  );
};

export default Filters;
