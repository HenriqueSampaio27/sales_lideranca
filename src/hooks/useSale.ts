import { useState, useCallback, RefObject } from "react";
import { InvoiceService } from "../services/InvoiceService";
import { PaymentData, PendingInfo } from "../types";
import { useCart } from "./useCart";
import { useClients } from "./useClients";

export interface UseSaleParams {
  cartState: ReturnType<typeof useCart>;
  clientsState: ReturnType<typeof useClients>;
  setIsPaymentOpen: (open: boolean) => void;
  setIsPendingModalOpen: (open: boolean) => void;
  barcodeInputRef: RefObject<HTMLInputElement | null>;
}

export function useSale({
  cartState,
  clientsState,
  setIsPaymentOpen,
  setIsPendingModalOpen,
  barcodeInputRef,
}: UseSaleParams) {
  const [isSaving, setIsSaving] = useState(false);
  const [saleCompleted, setSaleCompleted] = useState(false);
  const [lastInvoiceId, setLastInvoiceId] = useState<string | null>(null);

  const finalySave = useCallback(
    async (
      isPaid: boolean,
      paymentData: PaymentData | null,
      pendingInfo: PendingInfo | null = null
    ) => {
      setIsSaving(true);
      try {
        const payloadItems = cartState.cart.map((item) => {
          const discountVal = cartState.getItemDiscountValue(item);
          return {
            product_id: item.id,
            quantity: item.qty,
            unit_price_original: item.unit,
            discount_value: discountVal,
            unit_price_final: item.unit - discountVal,
          };
        });

        const payload = {
          customer_id: clientsState.selectedClient?.id || null,
          user_id: null,
          items: payloadItems,
          status: (isPaid ? "PAGO" : "PENDENTE") as "PAGO" | "PENDENTE",
          is_paid: isPaid,
          payment_method: paymentData,
          pending_info: pendingInfo,
        };

        const response = await InvoiceService.createInvoice(payload);

        if (response.invoice_id) {
          setLastInvoiceId(response.invoice_id);
          setSaleCompleted(true);
        } else {
          alert("Erro ao salvar venda.");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao salvar venda";
        alert(`Erro ao salvar venda: ${msg}`);
      } finally {
        setIsSaving(false);
      }
    },
    [cartState, clientsState.selectedClient]
  );

  const resetPOSState = useCallback(() => {
    setSaleCompleted(false);
    setIsPaymentOpen(false);
    setIsPendingModalOpen(false);
    setLastInvoiceId(null);
    cartState.clearCart();
    clientsState.setSelectedClient(null);
    setTimeout(() => {
      barcodeInputRef.current?.focus();
    }, 0);
  }, [cartState, clientsState, setIsPaymentOpen, setIsPendingModalOpen, barcodeInputRef]);

  return {
    isSaving,
    setIsSaving,
    saleCompleted,
    setSaleCompleted,
    lastInvoiceId,
    setLastInvoiceId,
    finalySave,
    resetPOSState,
  };
}
