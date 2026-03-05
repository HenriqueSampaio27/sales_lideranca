
import { Product, Sale, Client, FinancialNote } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Arroz Tio João Tipo 1 5kg',
    sku: 'MTS-8842-ARZ',
    category: 'Alimentos',
    quantity: 1240,
    minQuantity: 500,
    location: 'Corredor A-12',
    lastRestock: '20/05/2024',
    price: 24.90,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMOx6P-0lWgCB9lhwc4dr60QDNoT8Vlxef0Z8Ey0_uRIWchpZwf352Qf6zxmdDu9QZvMpUtUd67a4XahHztBdMSF9EW9kexl8K1fRSW4LxqNGK3BszfJIUWN2J_oXpQuchZ3Phy9R6j4zovsHrPwyfqL19Vnr3qsCgr080KD0FcvLLIVmXe80qDqT2x60XqHWHG9FcGmd2z_atIuFT9o3nW1uqpMhvwXGFVaW6DMWMU1NIqUwqLV1dCNbUjqgDiGaDt4B5ta0J7AI'
  },
  {
    id: '2',
    name: 'Leite Integral Betânia 1L',
    sku: 'MTS-2139-LTE',
    category: 'Bebidas',
    quantity: 12,
    minQuantity: 100,
    location: 'Câmara Fria 02',
    lastRestock: '22/05/2024',
    price: 5.49,
    status: 'low_stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3N15fj76EsLRjQpqDB_TX1j8FWfhthiZ2gJEd4ZjHAu28j00rOyyQnJrYIc0Fl1cedsH1As4m5Wt4IHoKw88Z7qAEQSpqymTxmNPLaAo2xAQYdo2cxrKtxxvU0Eg8QpnXo1tRFdmmmJh3in___GhbvHx9JrS9KmPrB-rjBMPR3uKk1xJ8VCsG7k3kxKPyI4LZB8cG1uaPdGMLB8Qunb5b0tuRmZUF72gLkN-MMxbz_ATR5wN4byE8GDhTFi7GKkCrLb9Kl1sKVHM'
  },
  {
    id: '3',
    name: 'Detergente Ypê Neutro 500ml',
    sku: 'MTS-5011-DET',
    category: 'Limpeza',
    quantity: 0,
    minQuantity: 200,
    location: 'Prateleira P-04',
    lastRestock: '15/05/2024',
    price: 2.15,
    status: 'out_of_stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsfrFduZqsC4mvki4C4UCR7MmJZ1pErkHYG7ZJyqV1-igR9GEIYDQOm8F6sDrMI52qoH7Im2haIi1MLVkcobImEqWk7QPTeJde_WPiBAjZ6XiwHSXV2FTp4owLw9nDjlRqlE8zRgl4xUtrBdM-lddeTkRPeCvCnFb_CeMkvfJgamcThUDT4hJAs6caXlzW_Dm8VbYFSp-kj4HpQxp9RcbIza_gBAilLnkfYPIH-HHYTcw5-h3I_ZB3_qBU9a8HUnuQ_lXBpMYpvow'
  },
  {
    id: '4',
    name: 'Coca-Cola Lata 350ml',
    sku: 'MTS-1044-REB',
    category: 'Bebidas',
    quantity: 456,
    minQuantity: 144,
    location: 'Frente de Loja 01',
    lastRestock: '23/05/2024',
    price: 3.99,
    status: 'active',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfkId4uI0hgPMViFthcIuCRYhLA1ibXOeHey3IDOGnHIjzPSA_nvksRQf1x83Wt-UC6Aa_oaQaqzRQfzGwP4IQGxpSTcr7ywvoDdqm6nF8QEmjDHjm_vVNOPONGM3WQKqpQxPAITFFNr1HxKgVdhHagf6Ph_gJ9HN1AK-TZK-8QKzfx3L7CaZDmJ_oufei8BXStIUGPDOSCDaM_vV_-ZoLugNrBw8ImG05cOUbfkyhkAkdkL23QAWLoZUG8Dp-cvYE0xzyEzRV1ko'
  }
];

export const MOCK_SALES: Sale[] = [
  { id: '#1092', date: '24/05 14:30', customer: 'João Silva', value: 450.00, status: 'concluded' },
  { id: '#1091', date: '24/05 14:15', customer: 'Maria Cavalcanti', value: 1280.00, status: 'concluded' },
  { id: '#1090', date: '24/05 13:55', customer: 'Ricardo Mendes', value: 89.90, status: 'cancelled' },
  { id: '#1089', date: '24/05 13:20', customer: 'Ana Ferreira', value: 3420.00, status: 'concluded' },
];

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Ricardo Oliveira Almeida', document: '045.332.XXX-09', email: 'ricardo.almeida@gmail.com', phone: '(98) 99122-3344', registrationDate: '24/05/2024' },
  { id: '2', name: 'Mateus Distribuidora SA', document: '07.234.XXX/0001-23', email: 'comercial@mateus.com.br', phone: '(98) 3212-0000', registrationDate: '23/05/2024' },
  { id: '3', name: 'Carla Vanessa Santos', document: '998.221.XXX-88', email: 'carla.vanessa@outlook.com', phone: '(99) 98844-1122', registrationDate: '22/05/2024' },
  { id: '4', name: 'José Pereira da Silva', document: '112.556.XXX-10', email: 'josep@terra.com.br', phone: '(98) 99100-5588', registrationDate: '20/05/2024' },
];

export const MOCK_FINANCIAL_NOTES: FinancialNote[] = [
  {
    id: '#NF-2024881',
    customer: 'Supermercado Alvorada Ltda',
    document: 'CNPJ: 12.345.678/0001-90',
    originalValue: 15400.00,
    dueBalance: 15400.00,
    dueDate: '12/05/2024',
    status: 'vencido'
  },
  {
    id: '#NF-2024902',
    customer: 'Distribuidora São José',
    document: 'CNPJ: 98.765.432/0001-11',
    originalValue: 8250.00,
    dueBalance: 8250.00,
    dueDate: '28/05/2024',
    status: 'avencer'
  },
  {
    id: '#NF-2024775',
    customer: 'Mercearia Do Povo',
    document: 'CPF: 123.456.789-00',
    originalValue: 5000.00,
    dueBalance: 1250.00,
    dueDate: '15/05/2024',
    status: 'parcial'
  },
  {
    id: '#NF-2024915',
    customer: 'Hortifruti Natureza',
    document: 'CNPJ: 55.444.333/0001-22',
    originalValue: 2900.00,
    dueBalance: 2900.00,
    dueDate: '10/05/2024',
    status: 'vencido'
  }
];

export const CHART_DATA = {
  '30d': [
    { name: '01 Mai', sales: 400 },
    { name: '07 Mai', sales: 300 },
    { name: '14 Mai', sales: 600 },
    { name: '21 Mai', sales: 800 },
    { name: '30 Mai', sales: 950 },
  ],
  '3m': [
    { name: 'Mar', sales: 1200 },
    { name: 'Abr', sales: 1500 },
    { name: 'Mai', sales: 2100 },
  ],
  '6m': [
    { name: 'Dez', sales: 800 },
    { name: 'Jan', sales: 1100 },
    { name: 'Fev', sales: 1400 },
    { name: 'Mar', sales: 1200 },
    { name: 'Abr', sales: 1500 },
    { name: 'Mai', sales: 2100 },
  ],
  '1y': [
    { name: 'Jun', sales: 500 },
    { name: 'Jul', sales: 700 },
    { name: 'Ago', sales: 600 },
    { name: 'Set', sales: 900 },
    { name: 'Out', sales: 1100 },
    { name: 'Nov', sales: 1300 },
    { name: 'Dez', sales: 800 },
    { name: 'Jan', sales: 1100 },
    { name: 'Fev', sales: 1400 },
    { name: 'Mar', sales: 1200 },
    { name: 'Abr', sales: 1500 },
    { name: 'Mai', sales: 2100 },
  ],
  '2y': [
    { name: '2024', sales: 15000 },
    { name: '2025', sales: 22000 },
    { name: '2026', sales: 12000 },
  ]
};




