export interface Client {
  id: number;
  name: string;
  phone: string;
  cnpj_cpf: string;
  email: string;
  logradouro: string;
  district: string;
  number: string;
  city: string;
  created_at: string;
}

export interface ClientFormData {
  id?: number;
  name: string;
  phone: string;
  cnpj_cpf: string;
  email: string;
  logradouro: string;
  district: string;
  number: string;
  city: string;
  created_at?: string;
}

export interface ClientResponse {
  total?: number | string;
  message?: string;
  data?: Client[] | Client;
}
