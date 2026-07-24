import { baseUrl } from "./AuthService";
import { Client, ClientFormData, ClientResponse } from "../types/client";

export const clientService = {
  async getClients(): Promise<Client[]> {
    const response = await fetch(`${baseUrl}/clients`);
    if (!response.ok) {
      throw new Error("Erro ao buscar clientes");
    }
    const data: Client[] = await response.json();
    return data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getTodayClients(): Promise<string | number> {
    const response = await fetch(`${baseUrl}/clients/today`);
    if (!response.ok) {
      throw new Error("Erro ao buscar clientes de hoje");
    }
    const data: ClientResponse = await response.json();
    return data.total !== undefined ? data.total : 0;
  },

  async saveClient(client: ClientFormData): Promise<Client> {
    const response = await fetch(`${baseUrl}/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error("Erro ao salvar cliente");
    }
    return await response.json();
  },

  async updateClient(id: number, client: ClientFormData): Promise<Client> {
    const response = await fetch(`${baseUrl}/clients/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(client),
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar cliente");
    }
    return await response.json();
  },

  async deleteClient(id: number): Promise<void> {
    const response = await fetch(`${baseUrl}/clients/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar cliente");
    }
  },
};
