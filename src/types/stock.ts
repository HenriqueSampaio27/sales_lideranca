export interface Product {
  id: number;
  product_name: string;
  barcode?: string;
  mark: string;
  stock: number | string;
  minStock: number | string;
  active?: boolean;
}

export interface SelectedProduct extends Product {
  requestQty: string;
  requestUnit: string;
}

export interface StockStatusResult {
  outOfStock: Product[];
  belowMinimum: Product[];
}

export type StockFilter = "all" | "out" | "minimum";