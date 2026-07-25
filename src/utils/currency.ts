/**
 * Converte string de valor monetário (ex: "1.000,50", "1000.50" ou "50,00") em number.
 */
export const parseCurrencyInput = (value: string): number => {
  if (!value) return 0;
  const cleanStr = value.trim().replace(/\./g, "").replace(",", ".");
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formata um número para moeda BRL (ex: "1.250,00").
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formata um valor numérico para o padrão de moeda brasileiro com o prefixo R$ opcional.
 */
export const formatBRL = (value: number, withPrefix = true): string => {
  const formatted = formatCurrency(value);
  return withPrefix ? `R$ ${formatted}` : formatted;
};
