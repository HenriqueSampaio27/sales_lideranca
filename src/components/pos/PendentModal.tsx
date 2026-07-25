import React, { useState, useMemo, useCallback } from "react";
import { X, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import Calendar from "../commom/Calendar";
import { PendingAccountConfirmData } from "../../types/payment";
import { parseDateString } from "../../utils/date";
import { formatCurrency, parseCurrencyInput } from "../../utils/currency";
import { posColors, borderRadius, shadows } from "../../theme";

export interface PendingAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: PendingAccountConfirmData) => void;
  totalAmount: number;
  onDestroy: () => void;
}

export function PendingAccountModal({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
}: PendingAccountModalProps): React.ReactElement | null {
  const [advanceAmount, setAdvanceAmount] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const parsedAdvance = useMemo(
    () => parseCurrencyInput(advanceAmount),
    [advanceAmount]
  );

  const remainingAmount = useMemo(
    () => Math.max(0, totalAmount - parsedAdvance),
    [totalAmount, parsedAdvance]
  );

  const isFormValid = useMemo(() => {
    if (!paymentDate) return false;
    const parsedDate = parseDateString(paymentDate);
    return parsedDate !== null;
  }, [paymentDate]);

  const handleAdvanceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAdvanceAmount(e.target.value);
    },
    []
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPaymentDate(e.target.value);
    },
    []
  );

  const handleCalendarSelect = useCallback((dateISO: string) => {
    const [year, month, day] = dateISO.split("-");
    if (day && month && year) {
      setPaymentDate(`${day}/${month}/${year}`);
    } else {
      setPaymentDate(dateISO);
    }
    setShowCalendar(false);
  }, []);

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) return;

      onConfirm({
        advanceAmount: parsedAdvance,
        paymentDate,
      });
    },
    [isFormValid, onConfirm, parsedAdvance, paymentDate]
  );

  if (!isOpen) return null;

  return (
    <div
      style={{ backgroundColor: posColors.overlay }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        style={{
          backgroundColor: posColors.modalBg,
          borderColor: posColors.modalBorder,
          borderRadius: borderRadius["2xl"],
          boxShadow: shadows.xl,
        }}
        className="w-full max-w-lg border overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* HEADER */}
        <div
          style={{
            backgroundColor: posColors.headerBg,
            borderColor: posColors.headerBorder,
          }}
          className="flex justify-between items-center px-6 py-4 border-b"
        >
          <h2
            style={{ color: posColors.textPrimary }}
            className="text-lg font-black italic uppercase"
          >
            Conta <span style={{ color: posColors.primary }}>Pendente</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal de conta pendente"
            style={{ color: posColors.textSecondary }}
            className="hover:text-red-600 transition-colors p-1 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
          {/* RESUMO TOTAL */}
          <div
            style={{
              backgroundColor: posColors.totalBoxBg,
              borderColor: posColors.totalBoxBorder,
              borderRadius: borderRadius.xl,
            }}
            className="p-4 border flex justify-between items-center"
          >
            <div>
              <p
                style={{ color: posColors.totalText }}
                className="text-[10px] font-bold uppercase tracking-widest"
              >
                Valor da Venda
              </p>
              <p
                style={{ color: posColors.totalText }}
                className="text-2xl font-black font-mono mt-0.5"
              >
                R$ {formatCurrency(totalAmount)}
              </p>
            </div>
          </div>

          {/* CAMPOS */}
          <div className="space-y-4">
            {/* ADIANTAMENTO */}
            <div>
              <label
                htmlFor="advanceAmount"
                style={{ color: posColors.textSecondary }}
                className="block text-xs font-bold uppercase mb-1.5"
              >
                Adiantamento (Entrada)
              </label>
              <input
                id="advanceAmount"
                type="text"
                inputMode="decimal"
                value={advanceAmount}
                onChange={handleAdvanceChange}
                placeholder="0,00"
                style={{
                  backgroundColor: posColors.inputBg,
                  borderColor: posColors.inputBorder,
                  color: posColors.textPrimary,
                  borderRadius: borderRadius.xl,
                }}
                className="w-full border px-4 py-2.5 font-mono outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* RESTANTE */}
            <div
              style={{
                backgroundColor: posColors.cardSecondaryBg,
                borderColor: posColors.cardBorder,
                borderRadius: borderRadius.xl,
              }}
              className="flex justify-between items-center px-4 py-3 border"
            >
              <span
                style={{ color: posColors.textSecondary }}
                className="text-xs font-bold uppercase"
              >
                Saldo Restante
              </span>
              <span
                style={{ color: posColors.textPrimary }}
                className="font-bold font-mono text-base"
              >
                R$ {formatCurrency(remainingAmount)}
              </span>
            </div>

            {/* DATA DE VENCIMENTO */}
            <div className="relative">
              <label
                htmlFor="paymentDate"
                style={{ color: posColors.textSecondary }}
                className="block text-xs font-bold uppercase mb-1.5"
              >
                Data Prometida de Pagamento *
              </label>
              <div className="relative">
                <input
                  id="paymentDate"
                  type="text"
                  value={paymentDate}
                  onChange={handleDateChange}
                  placeholder="DD/MM/AAAA"
                  style={{
                    backgroundColor: posColors.inputBg,
                    borderColor: posColors.inputBorder,
                    color: posColors.textPrimary,
                    borderRadius: borderRadius.xl,
                  }}
                  className="w-full border pl-4 pr-12 py-2.5 font-mono outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCalendar((prev) => !prev)}
                  aria-label="Abrir calendário"
                  style={{ color: posColors.textSecondary }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-amber-600 transition-colors p-1 cursor-pointer"
                >
                  <CalendarIcon size={18} />
                </button>
              </div>

              {showCalendar && (
                <div className="absolute z-10 top-full mt-2 left-0 right-0 shadow-2xl">
                  <Calendar
                    onSelectDate={handleCalendarSelect}
                    selectedDate={paymentDate}
                  />
                </div>
              )}
            </div>
          </div>

          {/* BOTÃO CONFIRMAR */}
          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              backgroundColor: isFormValid ? posColors.primary : "#CBD5E1",
              color: isFormValid ? posColors.textInverse : posColors.textMuted,
              borderRadius: borderRadius.xl,
              boxShadow: isFormValid ? shadows.glowPrimary : "none",
            }}
            className="w-full py-3.5 font-black text-base uppercase tracking-tight transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={20} />
            Confirmar Pendência
          </button>
        </form>
      </div>
    </div>
  );
}

export const PendentModal = PendingAccountModal;



