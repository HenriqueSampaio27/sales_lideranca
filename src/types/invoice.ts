import { PaymentData, PendingInfo } from "./payment";

export interface InvoiceItemPayload {
  product_id: string;
  quantity: number;
  unit_price_original: number;
  discount_value: number;
  unit_price_final: number;
  cost_price: number;
}

export interface CreateInvoicePayload {
  customer_id: number | null;
  user_id: string | null;
  items: InvoiceItemPayload[];
  status: "PAGO" | "PENDENTE";
  is_paid: boolean;
  payment_method: PaymentData | null;
  pending_info: PendingInfo | null;
}

export interface CreateInvoiceResponse {
  invoice_id: string;
  message?: string;
  error?: string;
}

export interface CouponData {
  id: string;
  issue_date: Date;
  companyName: string;
  cnpj?: string;
  address: string;
  cityStateZip: string;
}

export interface CouponItem {
  product_name: string;
  quantity: number;
  unit_price: number;
  discount_value: number;
}

export interface ItemsCoupon {
  rows: CouponItem[];
}
