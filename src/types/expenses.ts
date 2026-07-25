export type ExpenseStatus = 'pending' | 'delayed' | 'paid';

export type FilterMode = 'day' | 'month';

export interface ExpenseFiltersType {
  status?: string;
  category?: string;
  date?: string | null;
  mode?: FilterMode;
  search?: string;
}

export interface ExpenseType {
  id: string;
  name: string;
  category: string;
  document: string;
  due_date?: string;
  value: number;
  status: ExpenseStatus;
  notes?: string;
}

export interface CreateExpensePayload {
  name: string;
  category: string;
  document: string;
  due_date: string;
  value: number;
  status: string;
  notes?: string;
}

export interface ExpenseFormState {
  name: string;
  category: string;
  document: string;
  due_date: string;
  value: string;
  status: string;
  notes: string;
}
