export interface KeyboardShortcut {
  key: string;
  label: string;
  colorClass?: string;
}

export const POS_SHORTCUTS: KeyboardShortcut[] = [
  { key: "F1", label: "Busca Produtos" },
  { key: "F2", label: "Busca Clientes" },
  { key: "F3", label: "Desconto" },
  { key: "F6", label: "Vendedor" },
  { key: "ESC", label: "Cancelar", colorClass: "text-primary" },
];
