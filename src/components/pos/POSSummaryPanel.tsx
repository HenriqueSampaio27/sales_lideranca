import React from "react";
import { Client } from "../../types";
import { posColors, borderRadius, shadows } from "../../theme";

interface POSSummaryPanelProps {
  searchClient: string;
  selectedClient: Client | null;
  subTotal: number;
  discountTotal: number;
  total: number;
  itemsCount: number;
  isCartEmpty: boolean;
  onSearchClientChange: (value: string) => void;
  onSearchClientSubmit: (doc: string) => void;
  onOpenClientModal: () => void;
  onOpenPaymentModal: () => void;
  onOpenPendingModal: () => void;
}

export const POSSummaryPanel: React.FC<POSSummaryPanelProps> = ({
  searchClient,
  selectedClient,
  subTotal,
  discountTotal,
  total,
  itemsCount,
  isCartEmpty,
  onSearchClientChange,
  onSearchClientSubmit,
  onOpenClientModal,
  onOpenPaymentModal,
  onOpenPendingModal,
}) => {
  const [totalIntegral, totalDecimals] = total.toFixed(2).split(".");

  return (
    <aside
      style={{
        backgroundColor: posColors.summaryBg,
        borderColor: posColors.summaryBorder,
      }}
      className="w-80 md:w-96 border-l flex flex-col p-6 shadow-xl z-20"
    >
      {/* Cliente */}
      <div className="mb-8">
        <label
          style={{ color: posColors.textSecondary }}
          className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2"
        >
          Cliente (CPF/CNPJ)
        </label>
        <div className="relative group">
          <input
            value={searchClient}
            onChange={(e) => onSearchClientChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchClientSubmit(searchClient);
              }
              if (e.key === "F2") {
                e.preventDefault();
                onOpenClientModal();
              }
            }}
            style={{
              backgroundColor: posColors.inputBg,
              borderColor: posColors.inputBorder,
              borderRadius: borderRadius.xl,
              color: posColors.textPrimary,
            }}
            className="w-full border py-3.5 px-4 text-base font-bold tracking-wider focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder-slate-400"
            placeholder="Digite CPF ou CNPJ (F2)"
          />
          <button
            type="button"
            onClick={onOpenClientModal}
            aria-label="Buscar cliente"
            style={{ color: posColors.primary }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:scale-110 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined font-black">
              person_search
            </span>
          </button>
        </div>
        <div
          style={{
            backgroundColor: posColors.successLight,
            borderColor: posColors.successBorder,
            borderRadius: borderRadius.xl,
          }}
          className="mt-3 flex items-center gap-2.5 p-3 border"
        >
          <div
            style={{ backgroundColor: posColors.success }}
            className="size-2.5 rounded-full shadow-sm"
          />
          <span
            style={{ color: posColors.success }}
            className="text-xs font-bold uppercase tracking-wider truncate"
          >
            {selectedClient ? selectedClient.name : "Nenhum cliente selecionado"}
          </span>
        </div>
      </div>

      {/* Subtotais */}
      <div
        style={{ borderColor: posColors.cardBorder }}
        className="flex-1 space-y-5 pt-5 border-t"
      >
        <div className="flex justify-between items-center">
          <span
            style={{ color: posColors.textSecondary }}
            className="font-bold uppercase tracking-widest text-xs"
          >
            Subtotal
          </span>
          <span
            style={{ color: posColors.textPrimary }}
            className="text-xl font-mono font-black"
          >
            R$ {subTotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span
            style={{ color: posColors.success }}
            className="font-bold uppercase tracking-widest text-xs"
          >
            Descontos
          </span>
          <span
            style={{ color: posColors.success }}
            className="text-xl font-mono font-black"
          >
            - R$ {discountTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Total a Pagar */}
      <div
        style={{
          backgroundColor: posColors.totalBoxBg,
          borderColor: posColors.totalBoxBorder,
          borderRadius: borderRadius["2xl"],
        }}
        className="mt-auto mb-5 p-5 border-2 flex flex-col items-end shadow-sm"
      >
        <span
          style={{ color: posColors.totalText }}
          className="text-[10px] font-black uppercase tracking-[0.25em] mb-1"
        >
          Total a Pagar
        </span>
        <div
          style={{ color: posColors.totalText }}
          className="text-5xl font-black font-mono tracking-tighter leading-none"
        >
          <span className="text-3xl align-top mt-1 mr-1">R$</span>
          {totalIntegral}
          <span className="text-3xl">,{totalDecimals}</span>
        </div>
        <div
          style={{ color: posColors.textSecondary }}
          className="mt-3 text-xs font-bold italic uppercase tracking-widest"
        >
          {itemsCount} {itemsCount === 1 ? "item" : "itens"} no carrinho
        </div>
      </div>

      {/* Ações */}
      <div className="grid grid-cols-1 gap-3">
        <button
          type="button"
          onClick={onOpenPaymentModal}
          disabled={isCartEmpty}
          style={{
            backgroundColor: posColors.primary,
            color: posColors.textInverse,
            borderRadius: borderRadius.xl,
            boxShadow: shadows.glowPrimary,
          }}
          className="py-5 font-black text-xl hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-tight disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <span className="material-symbols-outlined font-black text-3xl">
            payments
          </span>
          FINALIZAR VENDA
        </button>
        <button
          type="button"
          onClick={onOpenPendingModal}
          style={{
            backgroundColor: posColors.cardBg,
            borderColor: posColors.cardBorder,
            borderRadius: borderRadius.xl,
            color: posColors.textPrimary,
          }}
          className="border py-3.5 font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">
            receipt_long
          </span>
          CONTA PENDENTE
        </button>
      </div>
    </aside>
  );
};


