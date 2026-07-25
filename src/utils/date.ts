/**
 * Tenta converter uma string DD/MM/AAAA para um objeto Date válido.
 */
export const parseDateString = (dateStr: string): Date | null => {
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    if (
      !isNaN(day) &&
      !isNaN(month) &&
      !isNaN(year) &&
      year > 1900 &&
      month >= 0 &&
      month < 12
    ) {
      const date = new Date(year, month, day);
      if (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year
      ) {
        return date;
      }
    }
  }
  return null;
};

/**
 * Retorna a hora atual formatada em HH:mm:ss.
 */
export const formatCurrentTime = (): string => {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

/**
 * Nomes dos meses em português.
 */
export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
] as const;

/**
 * Siglas dos dias da semana.
 */
export const WEEKDAYS = ["S", "T", "Q", "Q", "S", "S", "D"] as const;
