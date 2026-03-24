import { AlertCircle } from 'lucide-react';
import Calendar from './Calendar';

export default function Filters() {
  return (
    <div className="col-span-12 lg:col-span-3 space-y-6">
      <section className="bg-brand-surface p-5 rounded-xl border border-white/5 shadow-sm">
        <Calendar />

        <div className="mt-8 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-brand-on-surface-variant block mb-2 font-semibold">Status</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg text-sm p-2 text-brand-on-bg focus:ring-1 focus:ring-brand-primary outline-none appearance-none cursor-pointer">
              <option>Todos os Status</option>
              <option>Pendente</option>
              <option>Atrasado</option>
              <option>Pago</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-brand-on-surface-variant block mb-2 font-semibold">Unidade</label>
            <select className="w-full bg-white/5 border border-white/10 rounded-lg text-sm p-2 text-brand-on-bg focus:ring-1 focus:ring-brand-primary outline-none appearance-none cursor-pointer">
              <option>São Luís - Matriz</option>
              <option>Teresina - Filial 02</option>
              <option>Belém - Filial 05</option>
            </select>
          </div>

          <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest rounded-lg transition-all border border-white/10 active:scale-95">
            Limpar Filtros
          </button>
        </div>
      </section>

      <div className="bg-gradient-to-br from-brand-primary/10 to-transparent p-5 rounded-xl border border-brand-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle size={18} className="text-brand-primary" />
          <h4 className="text-sm font-bold text-brand-on-bg">Alerta de Fluxo</h4>
        </div>
        <p className="text-xs text-brand-on-surface-variant leading-relaxed">
          Existem <span className="text-brand-primary font-bold">4 duplicatas</span> vencendo nas próximas 24 horas que totalizam R$ 4.250,00.
        </p>
      </div>
    </div>
  );
}
