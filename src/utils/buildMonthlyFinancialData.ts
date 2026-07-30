import { DashboardInvoice,
    DashboardExpense,
    DashboardDuplicate,
    DashboardInvItems,
    FinancialMonthlyPoint
 } from "../types/dashboard";



export function buildMonthlyFinancialData(
  invoices: DashboardInvoice[],
  duplicates: DashboardDuplicate[],
  expenses: DashboardExpense[],
  invoiceItems: DashboardInvItems[]
): FinancialMonthlyPoint[] {

  const months = new Map<
    string,
    {
      receita: number;
      custos: number;
      despesas: number;
      expenses: number
    }
  >();

  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  // ============================
  // RECEITA (Invoices Pagas)
  // ============================

  invoices.forEach((invoice) => {

    if (invoice.status !== "PAGO") return;
    if (!invoice.issue_date) return;

    const date = new Date(invoice.issue_date);

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!months.has(key)) {
      months.set(key, {
        receita: 0,
        custos: 0,
        despesas: 0,
        expenses: 0
      });
    }

    months.get(key)!.receita += Number(invoice.total_amount) || 0;

  });

  // ============================
// MAPA DAS NOTAS
// ============================

const invoiceMap = new Map(
  invoices.map(inv => [inv.id, inv])
);

// ============================
// CPV
// ============================

    invoiceItems.forEach((item) => {

    const invoice = invoiceMap.get(item.invoice_id);

    if (!invoice) return;
    if (invoice.status !== "PAGO") return;
    if (!invoice.issue_date) return;

    const date = new Date(invoice.issue_date);

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!months.has(key)) {
        months.set(key, {
        receita: 0,
        custos: 0,
        despesas: 0,
        expenses: 0
        });
    }

    months.get(key)!.custos +=
        (Number(item.cost_price) || 0) *
        (Number(item.quantity) || 0);

    });

  // ============================
  // EXPENSES
  // ============================

  expenses.forEach((expense) => {

    if (!expense.due_date) return;

    const date = new Date(expense.due_date);

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!months.has(key)) {
      months.set(key, {
        receita: 0,
        custos: 0,
        despesas: 0,
        expenses: 0
      });
    }

    months.get(key)!.despesas += Number(expense.value) || 0;
    months.get(key)!.expenses += Number(expense.value) || 0;

  });

  // ============================
  // DUPLICATAS PAGAS
  // ============================

  duplicates.forEach((duplicate) => {

    if (duplicate.status !== "paid") return;
    if (!duplicate.due_date) return;

    const date = new Date(duplicate.due_date);

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!months.has(key)) {
      months.set(key, {
        receita: 0,
        custos: 0,
        despesas: 0,
        expenses: 0
      });
    }

    months.get(key)!.despesas += Number(duplicate.value) || 0;

  });

  // ============================
  // CONVERTE PARA ARRAY
  // ============================

  return [...months.entries()]
    .map(([key, values]) => {

      const [, month] = key.split("-");

      return {
        name: monthNames[Number(month)],
        receita: values.receita,
        despesas: values.despesas,
        lucro: values.receita - values.despesas,
        lucroReal: values.receita - values.custos - values.expenses
      };

    })
    .sort((a, b) => {

      const m1 = monthNames.indexOf(a.name);
      const m2 = monthNames.indexOf(b.name);

      return m1 - m2;

    });

}