import React from "react";
import { posColors, borderRadius, shadows } from "../../theme";

interface POSBarcodeBarProps {
  searchProduct: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (barcode: string) => void;
  onOpenProductModal: () => void;
}

export const POSBarcodeBar: React.FC<POSBarcodeBarProps> = ({
  searchProduct,
  inputRef,
  onSearchChange,
  onSearchSubmit,
  onOpenProductModal,
}) => {
  return (
    <div
      style={{
        backgroundColor: posColors.cardBg,
        borderColor: posColors.cardBorder,
      }}
      className="p-5 border-b flex gap-4 backdrop-blur-md"
    >
      <div className="relative flex-1">
        <span
          style={{ color: posColors.primary }}
          className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
        >
          barcode_scanner
        </span>
        <input
          ref={inputRef}
          value={searchProduct}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearchSubmit(searchProduct);
              onSearchChange("");
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }
            if (e.key === "F1") {
              e.preventDefault();
              onOpenProductModal();
            }
          }}
          style={{
            backgroundColor: posColors.inputBg,
            borderColor: posColors.inputBorder,
            borderRadius: borderRadius["2xl"],
            color: posColors.textPrimary,
          }}
          className="w-full border py-5 pl-14 pr-6 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-xl font-black uppercase tracking-tight outline-none"
          placeholder="código de barras (F1)"
          type="text"
        />
      </div>

      <button
        type="button"
        onClick={onOpenProductModal}
        style={{
          backgroundColor: posColors.primary,
          color: posColors.textInverse,
          borderRadius: borderRadius["2xl"],
          boxShadow: shadows.glowPrimary,
        }}
        className="font-black px-8 flex items-center gap-3 hover:opacity-95 active:scale-95 transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined font-black">add</span>
        <span className="uppercase tracking-widest text-sm">ADICIONAR</span>
      </button>
    </div>
  );
};


