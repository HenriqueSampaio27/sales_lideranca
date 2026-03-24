
import React from 'react';
import { Page } from '../types';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { path: "/stock", label: "Estoque", icon: "package_2" },
    { path: "/registration", label: "Produtos", icon: "inventory_2" },
    { path: "/clients", label: "Clientes", icon: "groups" },
    { path: "/financial", label: "Financeiro", icon: "attach_money" },
    { path: "/pos", label: "Terminal PDV", icon: "shopping_cart_checkout" },
    { path: "/duplicate", label: "Financeiro", icon: "attach_money"}
  ];

  return (
    <aside className="w-64 border-r border-border-dark flex flex-col bg-surface-dark shrink-0 fixed h-full z-30">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-lg shadow-primary/10">
          <span className="material-symbols-outlined font-bold">storefront</span>
        </div>
        <div>
          <h1 className="text-sm font-bold uppercase tracking-wider text-white">Liderança Construções</h1>
          <p className="text-[10px] text-slate-500 font-medium uppercase">Admin Panel</p>
        </div>
      </div>
      <nav className="flex flex-col gap-2 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
              ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className={`text-sm ${currentPage === item.path ? 'font-bold' : 'font-medium'}`}>
            {item.label}
            </span>
          </NavLink>
          ))}
      </nav>
      <div className="p-4 border-t border-border-dark mt-auto bg-black/20">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="size-9 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            RO
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate text-white">Pedro</p>
            <p className="text-[10px] text-slate-500 truncate">Gerente Logístico</p>
          </div>
          <button className="material-symbols-outlined text-slate-400 hover:text-red-400 text-sm transition-colors">logout</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
