import { PlusCircle, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import Filters from '../components/Filters';
import DuplicateTable from '../components/DuplicateTable';

export default function Duplicate() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-on-bg selection:bg-brand-primary selection:text-brand-bg">
      <main className="p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-brand-on-bg mb-2">Gestão de Duplicatas</h1>
            <p className="text-brand-on-surface-variant text-sm">Controle financeiro e monitoramento de vencimentos industriais.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="bg-surface-dark p-4 rounded-xl border border-white/5 min-w-[180px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-brand-on-surface-variant mb-1 font-semibold">Total Pendente</p>
              <p className="text-xl font-bold text-brand-primary">R$ 15.420,00</p>
            </div>
            
            <div className="bg-surface-dark p-4 rounded-xl border border-white/5 min-w-[180px] shadow-sm">
              <p className="text-[10px] uppercase tracking-widest text-brand-on-surface-variant mb-1 font-semibold">Próximos Vencimentos</p>
              <p className="text-xl font-bold text-brand-on-bg">12 <span className="text-sm font-medium text-brand-on-surface-variant">títulos</span></p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 bg-brand-primary text-brand-bg font-bold px-6 py-4 rounded-lg shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/20 transition-all"
            >
              <PlusCircle size={20} />
              <span>NOVA DUPLICATA</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-8">
          <Filters />
          <DuplicateTable />
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="bg-brand-surface-bright/80 backdrop-blur-md border border-white/10 p-4 rounded-full shadow-2xl flex items-center gap-3 group hover:border-brand-primary/50 transition-all"
        >
          <span className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-brand-bg shadow-lg group-hover:shadow-brand-primary/30 transition-all">
            <Printer size={20} />
          </span>
          <span className="text-sm font-bold text-white/90 pr-2">Gerar Relatório Consolidado</span>
        </motion.button>
      </div>
    </div>
  );
}
