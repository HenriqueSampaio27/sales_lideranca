export enum Page {
  LOGIN = 'login',
  DASHBOARD = 'dashboard',
  STOCK = 'stock',
  REGISTRATION = 'registration',
  CLIENTS = 'clients',
  POS = 'pos',
  FINANCIAL = 'financial',
  DUPLICATE = 'duplicate',
  EXPENSES = 'expenses',
}

export type NavItem = {
  label: string;
  icon: string;
  active?: boolean;
  danger?: boolean;
};