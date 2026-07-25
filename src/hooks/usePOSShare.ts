import { useCallback } from "react";
import { InvoiceService } from "../services/InvoiceService";
import { Client } from "../types";

export interface UsePOSShareParams {
  lastInvoiceId: string | null;
  selectedClient: Client | null;
}

export function usePOSShare({
  lastInvoiceId,
  selectedClient,
}: UsePOSShareParams) {
  const sendEmail = useCallback(async () => {
    if (!lastInvoiceId) return;
    try {
      await InvoiceService.sendEmail(
        lastInvoiceId,
        selectedClient?.email
      );
      alert("E-mail enviado com sucesso!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar e-mail";
      alert(msg);
    }
  }, [lastInvoiceId, selectedClient]);

  const sendWhatsApp = useCallback(() => {
    if (!lastInvoiceId || !selectedClient?.phone) {
      alert("Cliente sem telefone cadastrado");
      return;
    }
    const url = InvoiceService.getWhatsAppShareUrl(
      lastInvoiceId,
      selectedClient.phone
    );
    window.open(url, "_blank");
  }, [lastInvoiceId, selectedClient]);

  return {
    sendEmail,
    sendWhatsApp,
  };
}
