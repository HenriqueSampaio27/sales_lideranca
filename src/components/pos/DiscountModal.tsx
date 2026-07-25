import React, { useState } from "react";
import { posColors, borderRadius, shadows } from "../../theme";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPercent: (percent: number) => void;
  onApplyValue: (value: number) => void;
  onClearDiscount: () => void;
}

export const DiscountModal: React.FC<DiscountModalProps> = ({
  isOpen,
  onClose,
  onApplyPercent,
  onApplyValue,
  onClearDiscount,
}) => {
  const [discountType, setDiscountType] = useState<"percent" | "value">(
    "percent"
  );
  const [discountInput, setDiscountInput] = useState<string>("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const val = Number(discountInput);
    if (!isNaN(val) && val >= 0) {
      if (discountType === "percent") {
        onApplyPercent(val);
      } else {
        onApplyValue(val);
      }
    }
    setDiscountInput("");
    onClose();
  };

  return (
    <div
      style={{ backgroundColor: posColors.overlay }}
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
    >
      <div
        style={{
          backgroundColor: posColors.modalBg,
          borderColor: posColors.modalBorder,
          borderRadius: borderRadius["2xl"],
          boxShadow: shadows.xl,
        }}
        className="border w-full max-w-md p-6 animate-in zoom-in-95 duration-200"
      >
        <h2
          style={{ color: posColors.textPrimary }}
          className="text-xl font-bold uppercase tracking-tight mb-4"
        >
          Desconto Global
        </h2>

        {/* Tipo de desconto */}
        <div className="flex gap-3 mb-5">
          <button
            type="button"
            onClick={() => setDiscountType("percent")}
            style={{
              backgroundColor:
                discountType === "percent" ? posColors.primaryLight : posColors.cardBg,
              borderColor:
                discountType === "percent" ? posColors.primary : posColors.cardBorder,
              color:
                discountType === "percent" ? posColors.primaryHover : posColors.textPrimary,
              borderRadius: borderRadius.xl,
            }}
            className="flex-1 p-3 border font-bold text-center transition-all cursor-pointer"
          >
            <span className="text-lg block">%</span>
            <span className="text-xs uppercase tracking-wider">Porcentagem</span>
          </button>

          <button
            type="button"
            onClick={() => setDiscountType("value")}
            style={{
              backgroundColor:
                discountType === "value" ? posColors.primaryLight : posColors.cardBg,
              borderColor:
                discountType === "value" ? posColors.primary : posColors.cardBorder,
              color:
                discountType === "value" ? posColors.primaryHover : posColors.textPrimary,
              borderRadius: borderRadius.xl,
            }}
            className="flex-1 p-3 border font-bold text-center transition-all cursor-pointer"
          >
            <span className="text-lg block">R$</span>
            <span className="text-xs uppercase tracking-wider">Valor Fixo</span>
          </button>
        </div>

        {/* Campo */}
        <input
          type="number"
          autoFocus
          value={discountInput}
          onChange={(e) => setDiscountInput(e.target.value)}
          style={{
            backgroundColor: posColors.inputBg,
            borderColor: posColors.inputBorder,
            color: posColors.textPrimary,
            borderRadius: borderRadius.xl,
          }}
          className="w-full border p-3 text-xl font-mono font-bold outline-none focus:ring-2 focus:ring-amber-500"
          placeholder={
            discountType === "percent"
              ? "Digite a porcentagem"
              : "Digite o valor em R$"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") handleConfirm();
            if (e.key === "Escape") onClose();
          }}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              onClose();
              onClearDiscount();
            }}
            style={{
              backgroundColor: posColors.dangerLight,
              color: posColors.danger,
              borderColor: posColors.dangerBorder,
              borderRadius: borderRadius.xl,
            }}
            className="px-4 py-2.5 border text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            style={{
              backgroundColor: posColors.primary,
              color: posColors.textInverse,
              borderRadius: borderRadius.xl,
              boxShadow: shadows.glowPrimary,
            }}
            className="px-5 py-2.5 font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all cursor-pointer"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};


