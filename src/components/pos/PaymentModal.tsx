import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Banknote,
    CreditCard,
    QrCode,
    X,
    CheckCircle2,
    Printer,
    Mail,
    Share2,
    ShoppingCart,
} from "lucide-react";
import {
    PaymentData,
    PaymentMethodOption,
    SplitPaymentItem,
} from "../../types/payment";
import { formatCurrency, parseCurrencyInput } from "../../utils/currency";
import { posColors, borderRadius, shadows } from "../../theme";

export interface PaymentModalProps {
    isOpen: boolean;
    total: number;
    itemsCount: number;
    onClose: () => void;
    onCancel?: () => void;
    onDestroy: () => void;
    onConfirmPayment: (paymentData: PaymentData) => void;
    onSendWhats: () => void;
    onPrint: () => void;
    onSendEmail: () => void;
    isSaving: boolean;
    saleCompleted: boolean;
    onResetSale: () => void;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
    { id: "cash", name: "Dinheiro", icon: <Banknote size={24} /> },
    { id: "credit", name: "Cartão Crédito", icon: <CreditCard size={24} /> },
    { id: "debit", name: "Cartão Débito", icon: <CreditCard size={24} /> },
    { id: "pix", name: "PIX", icon: <QrCode size={24} /> },
];

export function PaymentModal({
    isOpen,
    total,
    itemsCount,
    onClose,
    onDestroy,
    onConfirmPayment,
    onSendWhats,
    onSendEmail,
    onResetSale,
    onPrint,
    isSaving,
    saleCompleted,
}: PaymentModalProps): React.ReactElement | null {
    const [isSplit, setIsSplit] = useState<boolean>(false);
    const [methodSingle, setMethodSingle] = useState<string>("Dinheiro");
    const [cashReceived, setCashReceived] = useState<string>("");
    const [splitPayments, setSplitPayments] = useState<SplitPaymentItem[]>([
        { method: "Dinheiro", value: "" },
        { method: "Cartão Crédito", value: "" },
    ]);

    const parsedReceived = useMemo(
        () => parseCurrencyInput(cashReceived),
        [cashReceived]
    );

    const parsedSplitValues = useMemo(
        () => splitPayments.map((p) => parseCurrencyInput(p.value)),
        [splitPayments]
    );

    const totalSplit = useMemo(
        () => parsedSplitValues.reduce((acc, val) => acc + val, 0),
        [parsedSplitValues]
    );

    const cashPaymentIndex = useMemo(
        () => splitPayments.findIndex((p) => p.method === "Dinheiro"),
        [splitPayments]
    );

    const cashValue = useMemo(
        () => (cashPaymentIndex !== -1 ? parsedSplitValues[cashPaymentIndex] : 0),
        [cashPaymentIndex, parsedSplitValues]
    );

    const hasCash = useMemo(
        () =>
        (!isSplit && methodSingle === "Dinheiro") ||
        (isSplit && cashPaymentIndex !== -1),
        [isSplit, methodSingle, cashPaymentIndex]
    );

    const changeAmount = useMemo(() => {
        if (!hasCash) return 0;
        const targetValue = isSplit ? cashValue : total;
        return Math.max(0, parsedReceived - targetValue);
    }, [hasCash, isSplit, cashValue, total, parsedReceived]);

    const isPaid = useMemo(() => {
        if (isSplit) {
        return totalSplit >= total;
        }
        return methodSingle !== "Dinheiro" || parsedReceived >= total;
    }, [isSplit, totalSplit, total, methodSingle, parsedReceived]);

    const computedPaymentData = useMemo<PaymentData>(() => {
        if (isSplit) {
        return splitPayments.map((p) => ({
            method: p.method,
            value: parseCurrencyInput(p.value),
        }));
        }
        return {
        method: methodSingle,
        value:
            methodSingle === "Dinheiro"
            ? parseCurrencyInput(cashReceived)
            : total,
        };
    }, [isSplit, splitPayments, methodSingle, cashReceived, total]);

    const handleSplitChange = useCallback(
        (index: number, rawValue: string) => {
        const numericValue = parseCurrencyInput(rawValue);

        setSplitPayments((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], value: rawValue };

            const otherIndex = index === 0 ? 1 : 0;
            const remaining = Math.max(0, total - numericValue);

            updated[otherIndex] = {
            ...updated[otherIndex],
            value: formatCurrency(remaining),
            };

            return updated;
        });
        },
        [total]
    );

    const handleFinish = useCallback(() => {
        onConfirmPayment(computedPaymentData);
    }, [onConfirmPayment, computedPaymentData]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
        <motion.div
            style={{ backgroundColor: posColors.overlay }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
            {isSaving ? (
            <div
                style={{
                backgroundColor: posColors.modalBg,
                borderColor: posColors.modalBorder,
                borderRadius: borderRadius["2xl"],
                boxShadow: shadows.xl,
                }}
                className="p-10 border text-center"
            >
                <p
                style={{ color: posColors.primary }}
                className="text-2xl font-bold animate-pulse"
                >
                Salvando venda...
                </p>
            </div>
            ) : saleCompleted ? (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                style={{
                backgroundColor: posColors.modalBg,
                borderColor: posColors.modalBorder,
                borderRadius: borderRadius["2xl"],
                boxShadow: shadows.xl,
                }}
                className="w-full max-w-md space-y-8 p-8 border"
            >
                <div className="space-y-4">
                <div
                    style={{ color: posColors.success }}
                    className="flex items-center gap-3"
                >
                    <CheckCircle2 className="w-10 h-10" />
                    <h2
                    style={{ color: posColors.textPrimary }}
                    className="text-3xl font-black tracking-tight"
                    >
                    Venda Finalizada!
                    </h2>
                </div>
                <p
                    style={{ color: posColors.textSecondary }}
                    className="text-sm leading-relaxed"
                >
                    O cupom fiscal foi emitido com sucesso e a transação foi aprovada.
                </p>
                </div>

                <div className="space-y-3">
                <button
                    type="button"
                    onClick={onPrint}
                    style={{
                    backgroundColor: posColors.primary,
                    color: posColors.textInverse,
                    borderRadius: borderRadius.xl,
                    boxShadow: shadows.glowPrimary,
                    }}
                    className="w-full h-12 font-bold text-base flex items-center justify-center gap-2 hover:opacity-95 transition-all cursor-pointer"
                >
                    <Printer className="w-5 h-5" />
                    Imprimir Cupom Térmico
                </button>

                <button
                    type="button"
                    onClick={onDestroy}
                    style={{
                    backgroundColor: posColors.cardSecondaryBg,
                    borderColor: posColors.cardBorder,
                    color: posColors.textPrimary,
                    borderRadius: borderRadius.xl,
                    }}
                    className="w-full h-12 border font-bold text-base flex items-center justify-center gap-2 hover:bg-slate-200/60 transition-all cursor-pointer"
                >
                    <Printer className="w-5 h-5" />
                    Imprimir Cupom
                </button>

                <button
                    type="button"
                    onClick={onSendEmail}
                    style={{
                    backgroundColor: posColors.cardSecondaryBg,
                    borderColor: posColors.cardBorder,
                    color: posColors.textPrimary,
                    borderRadius: borderRadius.xl,
                    }}
                    className="w-full h-12 border font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-200/60 transition-all cursor-pointer"
                >
                    <Mail className="w-5 h-5" />
                    Enviar por E-mail
                </button>

                <button
                    type="button"
                    onClick={onSendWhats}
                    style={{
                    backgroundColor: posColors.cardSecondaryBg,
                    borderColor: posColors.cardBorder,
                    color: posColors.textPrimary,
                    borderRadius: borderRadius.xl,
                    }}
                    className="w-full h-12 border font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-200/60 transition-all cursor-pointer"
                >
                    <Share2 className="w-5 h-5" />
                    Enviar via WhatsApp
                </button>
                </div>

                <div
                style={{ borderColor: posColors.cardBorder }}
                className="pt-3 border-t"
                >
                <button
                    type="button"
                    onClick={onResetSale}
                    style={{
                    backgroundColor: posColors.primaryLight,
                    borderColor: posColors.primary,
                    color: posColors.primaryHover,
                    borderRadius: borderRadius.xl,
                    }}
                    className="w-full h-12 border-2 font-bold flex items-center justify-center gap-2 hover:bg-amber-200/60 transition-all cursor-pointer"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Nova Venda
                </button>
                </div>
            </motion.div>
            ) : (
            <motion.div
                style={{
                backgroundColor: posColors.modalBg,
                borderColor: posColors.modalBorder,
                borderRadius: borderRadius["2xl"],
                boxShadow: shadows.xl,
                }}
                className="w-full max-w-2xl border overflow-hidden"
            >
                <div
                style={{
                    backgroundColor: posColors.headerBg,
                    borderColor: posColors.headerBorder,
                }}
                className="flex justify-between items-center px-6 py-5 border-b"
                >
                <h2
                    style={{ color: posColors.textPrimary }}
                    className="text-xl font-black italic uppercase"
                >
                    Finalizar{" "}
                    <span style={{ color: posColors.primary }}>Pagamento</span>
                </h2>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar modal"
                    style={{ color: posColors.textSecondary }}
                    className="hover:text-red-600 transition-colors cursor-pointer"
                >
                    <X size={24} />
                </button>
                </div>

                <div className="p-6 space-y-6">
                <div
                    style={{
                    backgroundColor: posColors.totalBoxBg,
                    borderColor: posColors.totalBoxBorder,
                    borderRadius: borderRadius.xl,
                    }}
                    className="flex justify-between items-center p-5 border"
                >
                    <div>
                    <p
                        style={{ color: posColors.totalText }}
                        className="text-xs uppercase font-bold tracking-wider"
                    >
                        Valor Total da Venda
                    </p>
                    <p
                        style={{ color: posColors.textSecondary }}
                        className="text-xs mt-0.5"
                    >
                        {itemsCount} {itemsCount === 1 ? "item" : "itens"} no carrinho
                    </p>
                    </div>

                    <div
                    style={{ color: posColors.totalText }}
                    className="text-4xl font-black font-mono tracking-tight"
                    >
                    R$ {formatCurrency(total)}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span
                    style={{ color: posColors.textPrimary }}
                    className="font-bold uppercase text-xs tracking-wider"
                    >
                    Pagamento dividido
                    </span>

                    <button
                    type="button"
                    onClick={() => setIsSplit((prev) => !prev)}
                    style={{
                        backgroundColor: isSplit
                        ? posColors.primary
                        : "#CBD5E1",
                    }}
                    className="w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer"
                    aria-label="Alternar pagamento dividido"
                    >
                    <div
                        className={`bg-white w-4 h-4 rounded-full transition transform ${
                        isSplit ? "translate-x-6" : ""
                        }`}
                    />
                    </button>
                </div>

                {!isSplit && (
                    <>
                    <div className="grid grid-cols-4 gap-3">
                        {PAYMENT_METHODS.map((methodOption) => {
                        const isSelected = methodSingle === methodOption.name;
                        return (
                            <button
                            key={methodOption.id}
                            type="button"
                            onClick={() => setMethodSingle(methodOption.name)}
                            style={{
                                backgroundColor: isSelected
                                ? posColors.primaryLight
                                : posColors.cardBg,
                                borderColor: isSelected
                                ? posColors.primary
                                : posColors.cardBorder,
                                color: isSelected
                                ? posColors.primaryHover
                                : posColors.textPrimary,
                                borderRadius: borderRadius.xl,
                            }}
                            className="flex flex-col items-center gap-2 py-4 border transition-all cursor-pointer shadow-2xs"
                            >
                            {methodOption.icon}
                            <span className="text-xs font-bold uppercase">
                                {methodOption.name}
                            </span>
                            </button>
                        );
                        })}
                    </div>

                    {methodSingle === "Dinheiro" && (
                        <input
                        type="text"
                        inputMode="decimal"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                        placeholder="Valor recebido em R$"
                        style={{
                            backgroundColor: posColors.inputBg,
                            borderColor: posColors.inputBorder,
                            color: posColors.textPrimary,
                            borderRadius: borderRadius.xl,
                        }}
                        className="w-full border px-4 py-3 text-lg font-mono outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    )}
                    </>
                )}

                {isSplit && (
                    <div className="grid grid-cols-2 gap-4">
                    {splitPayments.map((payment, index) => (
                        <div key={index} className="space-y-2">
                        <select
                            value={payment.method}
                            onChange={(e) => {
                            const updatedMethod = e.target.value;
                            setSplitPayments((prev) => {
                                const updated = [...prev];
                                updated[index] = {
                                ...updated[index],
                                method: updatedMethod,
                                };
                                return updated;
                            });
                            }}
                            style={{
                            backgroundColor: posColors.inputBg,
                            borderColor: posColors.inputBorder,
                            color: posColors.textPrimary,
                            borderRadius: borderRadius.xl,
                            }}
                            className="w-full border px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            {PAYMENT_METHODS.map((methodOption) => (
                            <option key={methodOption.id} value={methodOption.name}>
                                {methodOption.name}
                            </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            inputMode="decimal"
                            value={payment.value}
                            onChange={(e) =>
                            handleSplitChange(index, e.target.value)
                            }
                            placeholder="Valor em R$"
                            style={{
                            backgroundColor: posColors.inputBg,
                            borderColor: posColors.inputBorder,
                            color: posColors.textPrimary,
                            borderRadius: borderRadius.xl,
                            }}
                            className="w-full border px-3 py-2.5 text-base font-mono outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        </div>
                    ))}
                    </div>
                )}

                {!isSplit && (
                    <div
                    style={{ borderColor: posColors.cardBorder }}
                    className="flex justify-between items-center border-t pt-4"
                    >
                    <span
                        style={{ color: posColors.textSecondary }}
                        className="font-bold text-sm uppercase tracking-wider"
                    >
                        Troco:
                    </span>
                    <span
                        style={{ color: posColors.success }}
                        className="font-bold text-2xl font-mono"
                    >
                        R$ {formatCurrency(changeAmount)}
                    </span>
                    </div>
                )}

                <button
                    type="button"
                    disabled={!isPaid}
                    onClick={handleFinish}
                    style={{
                    backgroundColor: isPaid ? posColors.primary : "#CBD5E1",
                    color: isPaid ? posColors.textInverse : posColors.textMuted,
                    borderRadius: borderRadius.xl,
                    boxShadow: isPaid ? shadows.glowPrimary : "none",
                    }}
                    className="w-full py-4 font-black text-xl uppercase tracking-tight transition flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                >
                    <CheckCircle2 size={24} className="inline mr-2" />
                    Finalizar Venda
                </button>
                </div>
            </motion.div>
            )}
        </motion.div>
        </AnimatePresence>
    );
    }


