import { CreateInvoicePayload, CreateInvoiceResponse } from "../types";
import { baseUrl } from "./AuthService";
import { apiRequest } from "./apiClient";

export class InvoiceService {
  static async createInvoice(
    payload: CreateInvoicePayload
  ): Promise<CreateInvoiceResponse> {
    return apiRequest<CreateInvoiceResponse>("/invoices", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async sendEmail(
    invoiceId: string,
    email?: string
  ): Promise<{ message?: string }> {
    return apiRequest<{ message?: string }>(
      `/invoices/${invoiceId}/send-email`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );
  }

  static getDanfeUrl(invoiceId: string): string {
    return `${baseUrl}/generate-danfe/${invoiceId}`;
  }

  static getWhatsAppShareUrl(invoiceId: string, phone: string): string {
    const cleanPhone = phone.replace(/\D/g, "");
    const linkPDF = this.getDanfeUrl(invoiceId);
    const message = `Olá! Segue sua nota:\n${linkPDF}`;
    return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
}
