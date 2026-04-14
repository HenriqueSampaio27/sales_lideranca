import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar({onSelectDate}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date();

  // total de dias do mês
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // dia da semana do primeiro dia (0 = domingo)
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  const monthName = currentDate.toLocaleString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-black/20 rounded-lg p-4 text-center border border-white/5">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth}>
          <ChevronLeft size={16} />
        </button>

        <p className="text-xs font-bold uppercase text-slate-400">
          {monthName}
        </p>

        <button onClick={nextMonth}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* DIAS DA SEMANA */}
      <div className="grid grid-cols-7 gap-1 text-[10px] text-slate-500 mb-1">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* DIAS */}
      <div className="grid grid-cols-7 gap-1 text-[10px]">
        
        {/* Espaços vazios */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              onClick={() => {
                  const fullDate = new Date(year, month, day)
                    .toISOString()
                    .slice(0, 10);

                  onSelectDate(fullDate);
                }}
              key={day}
              className={`p-1 rounded cursor-pointer transition ${
                isToday
                  ? 'bg-primary text-background-dark font-bold'
                  : 'text-slate-400 hover:bg-white/10'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}