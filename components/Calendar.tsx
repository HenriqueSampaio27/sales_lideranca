import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const prevDays = [28, 29, 30];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-brand-primary flex items-center gap-2">
          <CalendarIcon size={14} />
          Período
        </h3>
        <div className="flex gap-1">
          <button className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-white/30 uppercase mb-2">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => <span key={d}>{d}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {prevDays.map(d => (
          <div key={`prev-${d}`} className="p-2 text-xs text-white/20 text-center">{d}</div>
        ))}
        {days.slice(0, 22).map(d => {
          const isSelected = d === 13;
          const isRange = d === 7;
          
          return (
            <div 
              key={d} 
              className={`p-2 text-xs text-center rounded cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-brand-primary text-brand-bg font-bold shadow-sm' 
                  : isRange
                    ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30 font-bold'
                    : 'text-brand-on-bg hover:bg-white/5'
              }`}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}
