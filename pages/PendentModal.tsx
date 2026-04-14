import { useState } from 'react';
import { 
  X, 
  ReceiptText, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Banknote, 
  CheckCircle2,
  Bell,
  UserCircle2,
  LayoutGrid,
  Receipt,
  PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PendingAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onDestroy: () => void;
  onConfirm: (data: { advanceAmount: number; paymentDate: string }) => void;
}

export function PendingAccountModal({ isOpen, onClose, totalAmount, onConfirm, onDestroy }: PendingAccountModalProps) {
  const [advanceAmount, setAdvanceAmount] = useState<string>('0,00');
  
  // Real Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date()); // Month/Year being viewed
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toLocaleDateString('pt-BR')
  );

  // Helper to parse currency string to number
  const parseCurrency = (val: string) => {
    return parseFloat(val.replace('.', '').replace(',', '.')) || 0;
  };

  const remaining = totalAmount - parseCurrency(advanceAmount);

  const handleConfirm = () => {
    onConfirm({
      advanceAmount: parseCurrency(advanceAmount),
      paymentDate: paymentDate
    });
    onClose();
  };

  // Calendar Logic
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setCurrentDate(newDate);
    setPaymentDate(newDate.toLocaleDateString('pt-BR'));
  };

  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    const days = [];
    
    // Padding for start of month (adjusting for Sunday start: 0=Sun, 1=Mon... 6=Sat)
    // The UI shows S T Q Q S S D (Sun to Sat or Mon to Sun?)
    // Standard in Brazil is usually Mon-Sun or Sun-Sat. 
    // The labels in the UI are: S T Q Q S S D. This usually means Seg, Ter, Qua, Qui, Sex, Sab, Dom.
    // So let's assume Monday is the first column.
    
    // Adjust JS getDay() (0=Sun, 1=Mon) to Monday-start (0=Mon, 6=Sun)
    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(<div key={`empty-${i}`} className="py-2"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const isSelected = 
        currentDate.getDate() === day && 
        currentDate.getMonth() === month && 
        currentDate.getFullYear() === year;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`py-2 text-xs rounded-full transition-all font-medium ${
            isSelected 
              ? 'bg-primary text-background-dark font-bold shadow-lg shadow-primary/20' 
              : 'text-slate-400 hover:bg-white/5'
          }`}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 0.80, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 15 }}
            className="w-full max-w-[520px] overflow-hidden rounded-2xl border border-white/10 bg-modal-bg shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-slate-100">Conta Pendente</h3>
                <p className="text-sm text-slate-400">Configure os detalhes do adiantamento e vencimento.</p>
              </div>
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Total Value Summary Card */}
              <div className="flex items-center justify-between rounded-xl bg-white/5 p-5 border-l-4 border-primary">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Valor Total da Nota</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Receipt className="size-6" />
                </div>
              </div>

              {/* Date Selection Section */}
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">Data Prevista de Pagamento</span>
                  <div className="mt-2 flex items-stretch">
                    <input 
                      className="block w-full rounded-l-xl border border-white/10 bg-white/5 px-4 py-3.5 text-slate-100 placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="DD/MM/AAAA" 
                      type="text" 
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                    />
                    <div className="flex items-center justify-center rounded-r-xl border border-l-0 border-white/10 bg-white/5 px-4 text-slate-400">
                      <CalendarIcon className="size-5" />
                    </div>
                  </div>
                </label>

                {/* Mini Calendar Widget */}
                <div className="rounded-xl bg-white/5 p-5 border border-white/5">
                  <div className="flex items-center justify-between mb-5">
                    <button onClick={handlePrevMonth} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                      <ChevronLeft className="size-4" />
                    </button>
                    <span className="text-sm font-bold text-slate-200">
                      {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </span>
                    <button onClick={handleNextMonth} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                      <span key={i} className="text-[10px] font-bold text-slate-500 mb-1">{day}</span>
                    ))}
                    {renderCalendarDays()}
                  </div>
                </div>
              </div>

              {/* Advance Amount Section */}
              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-300">Valor de Adiantamento</span>
                  <div className="mt-2 flex items-stretch">
                    <input 
                      className="block w-full rounded-l-xl border border-white/10 bg-white/5 px-4 py-3.5 text-slate-100 placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="0,00" 
                      type="text" 
                      value={advanceAmount}
                      onChange={(e) => setAdvanceAmount(e.target.value)}
                    />
                    <div className="flex items-center justify-center rounded-r-xl border border-l-0 border-white/10 bg-white/5 px-4 text-primary">
                      <Banknote className="size-5" />
                    </div>
                  </div>
                </label>
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-medium text-slate-500">Restante Pendente:</span>
                  <span className="text-sm font-bold text-slate-300">
                    R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-4 bg-white/[0.02] border-t border-white/10 px-6 py-5">
              <button 
                onClick={onClose}
                className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {handleConfirm()}}
                className="flex items-center gap-2 px-8 py-3 text-sm font-bold bg-primary text-background-dark rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/10"
              >
                <span>Confirmar Pendência</span>
                <CheckCircle2 className="size-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}