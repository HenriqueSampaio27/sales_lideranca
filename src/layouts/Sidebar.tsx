import React from "react";
import { SidebarProps, MenuGroup } from "../types/sidebar";
import { NavLink } from "react-router-dom";
import { sidebarColors } from "../theme";
import { Page } from "../types/pages";


export const Sidebar: React.FC<SidebarProps> = () => {
  

  const menuGroups: MenuGroup[] = [
    {
      title: "OPERAÇÃO",
      items: [
        { path: Page.DASHBOARD, label: "Dashboard", icon: "dashboard" },
        { path: Page.POS, label: "Vendas", icon: "shopping_cart_checkout" },
        { path: Page.FINANCIAL, label: "Financeiro", icon: "attach_money" },
        { path: Page.DUPLICATE, label: "Duplicatas", icon: "receipt" },
        { path: Page.EXPENSES, label: "Despesas", icon: "receipt_long" },
      ],
    },
    {
      title: "CADASTROS",
      items: [
        { path: Page.REGISTRATION, label: "Produtos", icon: "inventory_2" },
        { path: Page.CLIENTS, label: "Clientes", icon: "groups" },
      ],
    },
    {
      title: "ESTOQUE",
      items: [
        { path: Page.STOCK, label: "Estoque", icon: "package_2" },
      ],
    },
  ];

  return (
    <aside
      style={{
        backgroundColor: sidebarColors.bg,
        borderColor: sidebarColors.border,
      }}
      className="w-64 border-r flex flex-col shrink-0 fixed h-full z-30 select-none shadow-xs"
    >
      {/* CABEÇALHO DO SIDEBAR */}
      <div
        style={{ borderColor: sidebarColors.border }}
        className="p-5 flex items-center gap-3.5 border-b"
      >
        <div
          style={{
            backgroundColor: sidebarColors.badgeBg,
            color: sidebarColors.badgeIcon,
            borderColor: sidebarColors.badgeBorder,
          }}
          className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-xs"
        >
          <span className="material-symbols-outlined text-2xl font-bold">
            storefront
          </span>
        </div>
        <div className="overflow-hidden">
          <h1
            style={{ color: sidebarColors.textPrimary }}
            className="text-xs font-black uppercase tracking-tight truncate leading-tight"
          >
            Liderança Construções
          </h1>
          <p
            style={{ color: sidebarColors.textSecondary }}
            className="text-[8px] font-bold uppercase tracking-wider truncate"
          >
            Sistema de Gestão
          </p>
        </div>
      </div>

      {/* MENU NAVEGAÇÃO ORGANIZADO POR GRUPOS */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <h2
              style={{ color: sidebarColors.textSecondary }}
              className="px-3 text-[10px] font-black uppercase tracking-widest"
            >
              {group.title}
            </h2>

            <div className="space-y-1">
              {group.items.map((item) => {
              
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={({isActive}) => ({
                      backgroundColor: isActive ? sidebarColors.activeBg : "transparent",
                      borderColor: isActive ? sidebarColors.activeBorder : "transparent",
                      color: isActive ? sidebarColors.activeText : sidebarColors.textSecondary,
                    })}
                    className={({ isActive }) => `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border font-bold text-xs transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? "shadow-2xs font-bold"
                        : "hover:bg-[#2692fd] hover:text-[#0F172A] hover:border-[#CBD5E1]"
                    }`}
                  >
                    {({ isActive }) => (
                    <>
                    <span
                      style={{
                        color: isActive ? sidebarColors.activeIcon : "inherit",
                      }}
                      className="material-symbols-outlined text-xl transition-colors"
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                    </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ÁREA DO USUÁRIO */}
      <div
        style={{
          backgroundColor: sidebarColors.userCardBg,
          borderColor: sidebarColors.userCardBorder,
        }}
        className="p-4 border-t mt-auto"
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: sidebarColors.userAvatarBg,
              color: sidebarColors.userAvatarText,
              borderColor: sidebarColors.userAvatarBorder,
            }}
            className="w-9 h-9 rounded-full border flex items-center justify-center font-black text-xs shrink-0 shadow-2xs"
          >
            RO
          </div>
          <div className="flex-1 overflow-hidden">
            <p
              style={{ color: sidebarColors.textPrimary }}
              className="text-xs font-bold truncate leading-tight"
            >
              Pedro
            </p>
            <p
              style={{ color: sidebarColors.textSecondary }}
              className="text-[10px] font-medium truncate mt-0.5"
            >
              Gerente Logístico
            </p>
          </div>
          <button
            type="button"
            aria-label="Sair do sistema"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
