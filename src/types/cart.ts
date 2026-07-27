export interface CartItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  unit: number;
  pulse?: boolean;
  maxDiscountPercent?: number;
  appliedDiscountPercent?: number;
  cost_price: number;
}
