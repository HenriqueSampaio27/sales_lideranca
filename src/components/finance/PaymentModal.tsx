import React from "react";
import { DollarSign, Check, X } from "lucide-react";
import { Invoice } from "../../types/finance";
import { Modal, Input, Button } from "../ui";
import { colors, typography } from "../../theme";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNote: Invoice | null;
  paymentValue: string;
  setPaymentValue: (value: string) => void;
  onConfirmPayment: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedNote,
  paymentValue,
  setPaymentValue,
  onConfirmPayment,
}) => {
  const pendingBalance = selectedNote
    ? Number(selectedNote.total_amount ?? 0) - Number(selectedNote.total_paid ?? 0)
    : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Pagamento"
      subtitle={
        selectedNote
          ? `Cliente: ${selectedNote.customer_name} — Saldo devedor: ${pendingBalance.toLocaleString(
              "pt-BR",
              { style: "currency", currency: "BRL" }
            )}`
          : "Informe o valor pago para quitar ou amortizar a nota."
      }
      icon={<DollarSign className="w-5 h-5 text-amber-600" />}
      maxWidth="md"
    >
      <div className="p-6 space-y-5">
        <div className="space-y-1.5">
          <label
            style={{
              color: colors.textSecondary,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
            }}
            className="uppercase tracking-wider"
          >
            Valor do Pagamento (R$)
          </label>
          <Input
            type="number"
            step="0.01"
            placeholder="Digite o valor"
            value={paymentValue}
            onChange={(e) => setPaymentValue(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button variant="secondary" size="md" onClick={onClose}>
            <X className="w-4 h-4 mr-1.5" />
            Cancelar
          </Button>

          <Button variant="primary" size="md" onClick={onConfirmPayment}>
            <Check className="w-4 h-4 mr-1.5" />
            Aprovar Pagamento
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal;
