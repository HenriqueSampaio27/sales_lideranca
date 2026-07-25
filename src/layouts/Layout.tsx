import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Page } from "../types/pages";
import { colors, sidebarColors } from "../theme";

const Layout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.STOCK);
  const location = useLocation();

  const isFullScreen = location.pathname === "/pos";

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
      }}
      className="flex h-screen overflow-hidden font-sans select-none"
    >
      {!isFullScreen && (
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      <main
        className={`flex-1 flex flex-col overflow-hidden ${
          isFullScreen ? "" : "ml-64"
        }`}
      >

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>

        {!isFullScreen && (
          <footer
            style={{
              backgroundColor: sidebarColors.bg,
              borderColor: sidebarColors.border,
            }}
            className="mt-auto border-t py-6 px-10 text-center"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
              <p
                style={{ color: colors.textSecondary }}
                className="text-[10px] font-black uppercase tracking-[0.3em]"
              >
                © 2023{" "}
                <span style={{ color: colors.textPrimary }}>
                  LIDERANÇA CONSTRUÇÕES
                </span>{" "}
                - Todos os direitos reservados
              </p>
              <div className="flex gap-8">
                <a
                  href="#"
                  style={{ color: colors.textSecondary }}
                  className="text-[10px] hover:text-[#FF0000] font-black uppercase tracking-widest transition-colors"
                >
                  Suporte
                </a>
                <a
                  href="#"
                  style={{ color: colors.textSecondary }}
                  className="text-[10px] hover:text-[#FF0] font-black uppercase tracking-widest transition-colors"
                >
                  Termos
                </a>
                <a
                  href="#"
                  style={{ color: colors.textSecondary }}
                  className="text-[10px] hover:text-[#D97706] font-black uppercase tracking-widest transition-colors"
                >
                  Privacidade
                </a>
              </div>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};

export default Layout;
