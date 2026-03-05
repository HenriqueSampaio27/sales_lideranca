
export enum Page {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  STOCK = 'stock',
  REGISTRATION = 'registration',
  CLIENTS = 'clients',
  POS = 'pos',
  FINANCIAL = 'financial'
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity?: number; // Minimum stock level
  location?: string;    // Warehouse location
  lastRestock?: string; // Date of last restock
  price: number;
  status: 'active' | 'inactive' | 'low_stock' | 'out_of_stock';
  image: string;
}

export interface Sale {
  id: string;
  date: string;
  customer: string;
  value: number;
  status: 'concluded' | 'cancelled' | 'pending';
}

export interface Client {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  registrationDate: string;
}

export interface FinancialNote {
  id: string;
  customer: string;
  document: string;
  originalValue: number;
  dueBalance: number;
  dueDate: string;
  status: 'vencido' | 'avencer' | 'parcial';
}
