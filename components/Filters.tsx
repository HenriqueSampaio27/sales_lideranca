import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import Calendar from './Calendar';

export default function Filters({ onFilterChange, alertCount, valueDuplicate  }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [status, setStatus] = useState('');

  // Sempre que os filtros mudarem, avisa o componente pai
  useEffect(() => {
    onFilterChange({
      date: selectedDate,
      status: status
    });
  }, [selectedDate, status, onFilterChange]);

  return (
    <div className="col-span-12 lg:col-span-3 space-y-6">
      
      {/* CARD DE FILTROS */}
      <section className="bg-surface-dark p-5 rounded-2xl border border-border-dark shadow-sm">
        
        {/* CALENDÁRIO */}
        <Calendar onSelectDate={setSelectedDate} />

        {/* FILTROS */}
        <div className="mt-8 space-y-4">
          
          {/* STATUS */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 block mb-2 font-black">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-background-dark border border-border-dark rounded-xl text-xs font-bold p-3 text-white focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
            >
              <option value="">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="delayed">Atrasado</option>
              <option value="paid">Pago</option>
            </select>
          </div>

          {/* LIMPAR FILTROS */}
          <button
            onClick={() => {
              setSelectedDate(null);
              setStatus('');
            }}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-border-dark active:scale-95"
          >
            Limpar Filtros
          </button>
        </div>
      </section>

      {/* ALERTA */}
      <div className="bg-gradient-to-br from-primary/10 to-transparent p-5 rounded-2xl border border-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle size={18} className="text-primary" />
          <h4 className="text-xs font-black text-white uppercase tracking-widest">
            Alerta de Fluxo
          </h4>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Existem <span className="text-primary font-black">{alertCount} duplicatas</span> vencendo nas próximas 24 horas que totalizam R$ {valueDuplicate}.
        </p>
      </div>
    </div>
  );
}