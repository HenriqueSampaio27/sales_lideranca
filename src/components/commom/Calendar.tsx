import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { colors, borderRadius, typography, shadows, animations } from '../../theme';

interface CalendarProps {
  onSelectDate: (date: string) => void;
  selectedDate?: string | null;
}

export const Calendar: React.FC<CalendarProps> = ({ onSelectDate, selectedDate }) => {
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
    <div 
      className="p-4 text-center border"
      style={{
        backgroundColor: colors.cardSecondary,
        borderColor: colors.border,
        borderRadius: borderRadius.xl,
        fontFamily: typography.fontFamily.sans.join(', '),
        transition: animations.transitionNormal,
      }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prevMonth}
          className="p-1.5 transition-colors cursor-pointer"
          style={{ 
            borderRadius: borderRadius.md,
            color: colors.textSecondary,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = colors.textPrimary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
          aria-label="Mês anterior"
        >
          <ChevronLeft size={16} />
        </button>

        <p 
          className="text-xs font-bold uppercase tracking-wider capitalize"
          style={{ color: colors.textPrimary }}
        >
          {monthName}
        </p>

        <button
          type="button"
          onClick={nextMonth}
          className="p-1.5 transition-colors cursor-pointer"
          style={{ 
            borderRadius: borderRadius.md,
            color: colors.textSecondary,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = colors.textPrimary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
          aria-label="Próximo mês"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* DIAS DA SEMANA */}
      <div 
        className="grid grid-cols-7 gap-1 text-[10px] font-bold mb-2 uppercase tracking-wider"
        style={{ color: colors.textSecondary }}
      >
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

          const formattedDayDate = new Date(year, month, day)
            .toISOString()
            .slice(0, 10);

          const isSelected = selectedDate === formattedDayDate;

          let buttonStyle: React.CSSProperties = {
            borderRadius: borderRadius.md,
            transition: animations.transitionFast,
            color: colors.textPrimary,
          };

          if (isSelected) {
            buttonStyle = {
              ...buttonStyle,
              backgroundColor: colors.primary,
              color: '#FFFFFF',
              boxShadow: shadows.sm,
            };
          } else if (isToday) {
            buttonStyle = {
              ...buttonStyle,
              backgroundColor: colors.primaryLight,
              color: colors.primaryHover,
              borderColor: colors.primary,
              borderWidth: '1px',
              borderStyle: 'solid',
            };
          }

          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDate(formattedDayDate)}
              className={`p-1.5 cursor-pointer text-center font-medium ${
                isSelected ? 'scale-105 font-bold' : ''
              }`}
              style={buttonStyle}
              onMouseEnter={(e) => {
                if (!isSelected && !isToday) {
                  e.currentTarget.style.backgroundColor = colors.border;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected && !isToday) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
