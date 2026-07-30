export interface DashboardInvoice {
  id: string;
  invoice_id?: string;
  customer_name?: string;
  client?: string;
  due_date?: string;
  issue_date?:string;
  total_paid?: string;
  created_at?: string;
  total_amount?: number | string;
  status?: "PAGO" | "PENDENTE" | "CANCELADO" | string;
  payment_method?: string | { method?: string; type?: string };
}

export interface DashboardProduct {
  id: number ;
  product_name: string;
  category?: string;
  stock: number | string;
  minStock?: number | string;
  price_cost: number | string;
  price_sell?: number | string;
  active?: boolean;
  sales_count?: number;
}

export interface DashboardInvItems {
  id?: number;
  product_id: string;
  invoice_id: string;
  product_name?: string;
  cost_price?: number
  sales_count?: number;
  quantity: number;
}

export interface DashboardDuplicate {
  id: string;
  client: string;
  document?: string;
  due_date: string;
  value: number | string;
  status: "pending" | "delayed" | "paid" | string;
}

export interface DashboardExpense {
  id: string | number;
  description?: string;
  value: number | string;
  due_date?: string;
  status?: string;
}

export interface ChartPoint {
  name: string;
  sales: number;
  expenses?: number;
  pending?: number;
}

export interface StockMovementPoint {
  period: string;
  entradas: number;
  saidas: number;
}

export interface PaymentDistributionPoint {
  name: string;
  value: number;
  color: string;
}

export interface FinancialMonthlyPoint {
  name: string;
  receita: number;
  despesas: number;
  lucro: number;
  lucroReal: number;
}

export interface ProfitLinePoint {
  name: string;
  lucro: number;
  margemPct: number;
}

export interface FinancialStatusPoint {
  name: string;
  valor: number;
  color: string;
}

export interface FinancialEvolutionPoint {
  name: string;
  faturamento: number;
  lucro: number;
  pendentes: number;
  totalNotas: number;
}

export interface TopProductStockPoint {
  name: string;
  valorTotal: number;
  quantidade: number;
}

export interface TopProductSalesPoint {
  name: string;
  vendas: number;
}

export interface AlertItem {
  id: string;
  type: "critical" | "warning" | "normal";
  title: string;
  description: string;
  badgeText: string;
  countOrValue: string;
  iconName: string;
}