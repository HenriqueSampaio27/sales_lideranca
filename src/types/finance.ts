export interface InvoiceItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price_original: number | string;
  discount_value: number | string;
}

export interface Invoice {
  id: number;
  customer_name: string;
  cnpj_cpf: string;
  invoice_number: string;
  issue_date: string;
  due_date: string | null;
  status: "PAGO" | "PENDENTE";
  total_amount: number | string;
  total_paid: number | string;
  items: InvoiceItem[];
}

export interface PaymentPayload {
  amount: number;
}

export interface FinanceFiltersState {
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
}

export interface FinanceStats {
  pendingNotDue: number;
  dueToday: number;
  overdue: number;
  totalPendingCount: number;
  overdueCount: number;
  overduePercentage: string | number;
}
