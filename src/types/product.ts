export interface Product {
  id: string;
  product_name: string;
  barcode: string;
  sale_price: number | string;
  price_cost: number | string;
  stock: number | string;
  unit: string;
  mark: string;
  sku: string;
  discount: string;
  minStock: number | string;
  active: boolean;
  image?: string;
}

export interface ProductFormData {
  id: string;
  product_name: string;
  barcode: string;
  sale_price: string;
  price_cost: string;
  stock: string;
  unit: string;
  sku: string;
  mark: string;
  image: string;
  minStock: string;
  discount: string;
}

export interface ApiResponse {
  message?: string;
  id?: string;
  [key: string]: unknown;
}
