import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Page } from '../types';

const Layout: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
 
  
    return (
    <div className="flex h-screen overflow-hidden bg-background-dark">
      <Sidebar 
        currentPage={currentPage}
        onPageChange={setCurrentPage}/>

      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        <header className="h-16 border-b border-border-dark flex items-center justify-between px-8 bg-surface-dark/50 backdrop-blur-md sticky top-0 z-20">
          <h2 className="text-xl font-black tracking-tighter uppercase italic">
            System <span className="text-primary">Sales</span>
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
        <footer className="mt-auto border-t border-border-dark py-8 px-10 text-center bg-black/30">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
                <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">
                  © 2026 <span className="text-slate-400">LIDERANÇA CONSTRUÇÕES</span> - Todos os direitos reservados
                </p>
                <div className="flex gap-8">
                  <a href="#" className="text-[10px] text-slate-600 hover:text-primary font-black uppercase tracking-widest transition-colors">Suporte</a>
                  <a href="#" className="text-[10px] text-slate-600 hover:text-primary font-black uppercase tracking-widest transition-colors">Termos</a>
                  <a href="#" className="text-[10px] text-slate-600 hover:text-primary font-black uppercase tracking-widest transition-colors">Privacidade</a>
                </div>
              </div>
            </footer>
      </main>
    </div>
    );
};

export default Layout;
