import { baseUrl } from "./AuthService";
import { Invoice } from "../types/finance";

export const financeService = {
  async getFinancialNotes(): Promise<Invoice[]> {
    const response = await fetch(`${baseUrl}/financial-notes`);
    if (!response.ok) {
      throw new Error("Erro ao buscar notas financeiras");
    }
    const data: Invoice[] = await response.json();
    return data;
  },

  async payInvoice(id: number, amount: number): Promise<void> {
    const response = await fetch(`${baseUrl}/invoices/${id}/pay`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });
    if (!response.ok) {
      throw new Error("Erro ao registrar pagamento");
    }
  },

  async deleteInvoice(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/invoices/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao excluir nota");
    }
  },

  getDanfeUrl(id: number): string {
    return `${baseUrl}/generate-danfe/${id}`;
  },
};
