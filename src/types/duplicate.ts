export type DuplicateStatus = 'pending' | 'delayed' | 'paid';

export type FilterMode = 'day' | 'month';

export interface FiltersType {
  status?: string;
  date?: string | null;
  mode?: FilterMode;
}

export interface DuplicateType {
  id: string;
  client: string;
  cnpj: string;
  document: string;
  due_date: string;
  value: number;
  status: DuplicateStatus;
  initials: string;
}

export interface CreateDuplicatePayload {
  client: string;
  cnpj: string;
  document: string;
  dueDate: string;
  value: number;
  status: string;
}

export interface DuplicateFormState {
  client: string;
  cnpj: string;
  document: string;
  dueDate: string;
  value: string;
  status: string;
}
