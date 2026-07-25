import { baseUrl } from "./AuthService";
import { ExpenseType, CreateExpensePayload } from "../types/expenses";

export const expensesService = {
  async getExpenses(): Promise<ExpenseType[]> {
    const res = await fetch(`${baseUrl}/expenses`);

    if (!res.ok) {
      throw new Error("Erro ao buscar despesas");
    }

    return res.json();
  },

  async confirmPayment(id: string): Promise<void> {
    const res = await fetch(`${baseUrl}/expenses/${id}/pay`, {
      method: "PATCH",
    });

    if (!res.ok) {
      throw new Error("Erro ao confirmar pagamento");
    }
  },

  async deleteExpense(id: string): Promise<void> {
    const res = await fetch(`${baseUrl}/expenses/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Erro ao excluir despesa");
    }
  },

  async createExpense(payload: CreateExpensePayload): Promise<ExpenseType> {
    const res = await fetch(`${baseUrl}/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Erro ao criar despesa");
    }

    return res.json();
  },

  async updateExpense(
    id: string,
    payload: Partial<CreateExpensePayload>
  ): Promise<ExpenseType> {
    const res = await fetch(`${baseUrl}/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Erro ao atualizar despesa");
    }

    return res.json();
  }
};
