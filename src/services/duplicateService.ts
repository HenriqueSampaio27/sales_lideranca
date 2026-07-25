import { baseUrl } from "./AuthService";
import { DuplicateType, CreateDuplicatePayload } from "../types/duplicate";

export const duplicateService = {
  async getDuplicates(): Promise<DuplicateType[]> {
    const res = await fetch(`${baseUrl}/duplicates`);
    if (!res.ok) {
      throw new Error("Erro ao buscar duplicatas");
    }
    const data: DuplicateType[] = await res.json();
    return data;
  },

  async confirmPayment(id: string): Promise<void> {
    const res = await fetch(`${baseUrl}/duplicates/${id}/pay`, {
      method: "PATCH",
    });
    if (!res.ok) {
      throw new Error("Erro ao atualizar pagamento");
    }
  },

  async deleteDuplicate(id: string): Promise<void> {
    const res = await fetch(`${baseUrl}/duplicates/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Erro ao deletar duplicata");
    }
  },

  async createDuplicate(payload: CreateDuplicatePayload): Promise<DuplicateType> {
    const res = await fetch(`${baseUrl}/duplicates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error("Erro ao criar duplicata");
    }
    const data: DuplicateType = await res.json();
    return data;
  },

  async saveDuplicate(payload: CreateDuplicatePayload): Promise<DuplicateType> {
    return this.createDuplicate(payload);
  },
};
