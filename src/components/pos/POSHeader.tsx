import React from "react";
import { posColors, borderRadius, shadows } from "../../theme";

interface POSHeaderProps {
  isQuoteMode: boolean;
  currentTime: string;
  onToggleQuoteMode: () => void;
  onExit: () => void;
}

export const POSHeader: React.FC<POSHeaderProps> = ({
  isQuoteMode,
  currentTime,
  onToggleQuoteMode,
  onExit,
}) => {
  return (
    <header
      style={{
        backgroundColor: posColors.headerBg,
        borderColor: posColors.headerBorder,
      }}
      className="flex items-center justify-between px-6 py-3 border-b shadow-sm"
    >
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div
            style={{
              backgroundColor: posColors.primary,
              color: posColors.textInverse,
              borderRadius: borderRadius.xl,
              boxShadow: shadows.glowPrimary,
            }}
            className="p-2.5 flex items-center justify-center"
          >
            <span className="material-symbols-outlined block text-2xl font-black">
              shopping_cart
            </span>
          </div>
          <h1
            style={{ color: posColors.textPrimary }}
            className="text-xl font-black tracking-tighter uppercase italic"
          >
            Liderança{" "}
            <span style={{ color: posColors.primary }}>Construções</span>
          </h1>
        </div>
        <div
          style={{ backgroundColor: posColors.headerBorder }}
          className="h-8 w-px hidden md:block"
        ></div>
        <div className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
          <div
            style={{ color: posColors.textSecondary }}
            className="flex items-center gap-2"
          >
            <span
              style={{ color: posColors.primary }}
              className="material-symbols-outlined text-sm"
            >
              store
            </span>
            <span>Santa Inês - Loja 01</span>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: posColors.cardSecondaryBg,
          borderColor: posColors.cardBorder,
          borderRadius: borderRadius.xl,
        }}
        className="flex items-center gap-3 px-4 py-2 border"
      >
        <span
          style={{ color: posColors.textSecondary }}
          className="text-xs font-bold uppercase"
        >
          Orçamento
        </span>

        <button
          type="button"
          onClick={onToggleQuoteMode}
          aria-label="Alternar modo orçamento"
          style={{
            backgroundColor: isQuoteMode
              ? posColors.quoteModeActiveBg
              : "#CBD5E1",
          }}
          className="w-14 h-7 flex items-center rounded-full transition-all cursor-pointer"
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-all ${
              isQuoteMode ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div
          style={{
            backgroundColor: posColors.cardSecondaryBg,
            borderColor: posColors.cardBorder,
            borderRadius: borderRadius.xl,
          }}
          className="flex items-center gap-2 px-4 py-2 border"
        >
          <span
            style={{ color: posColors.primary }}
            className="material-symbols-outlined text-xl"
          >
            schedule
          </span>
          <span
            style={{ color: posColors.textPrimary }}
            className="text-lg font-mono font-black"
          >
            {currentTime}
          </span>
        </div>

        <button
          type="button"
          aria-label="Configurações"
          style={{
            borderRadius: borderRadius.xl,
            color: posColors.textSecondary,
          }}
          className="p-2.5 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>

        <button
          type="button"
          onClick={onExit}
          aria-label="Sair do PDV"
          style={{
            borderRadius: borderRadius.xl,
            color: posColors.danger,
          }}
          className="p-2.5 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </header>
  );
};


