import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  onSelectDate: (date: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ onSelectDate }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
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
    year: 'numeric',
  });

  return (
    <div className="bg-slate-100/80 rounded-xl p-4 text-center border border-slate-200">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
        >
          <ChevronLeft size={16} />
        </button>

        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {monthName}
        </p>

        <button
          type="button"
          onClick={nextMonth}
          className="p-1 rounded hover:bg-slate-200 text-slate-600 transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* DIAS DA SEMANA */}
      <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-slate-400 mb-1">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>

      {/* DIAS */}
      <div className="grid grid-cols-7 gap-1 text-xs">
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
              key={day}
              onClick={() => {
                const fullDate = new Date(year, month, day)
                  .toISOString()
                  .slice(0, 10);

                onSelectDate(fullDate);
              }}
              className={`p-1.5 rounded-lg cursor-pointer transition text-center font-medium ${
                isToday
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
