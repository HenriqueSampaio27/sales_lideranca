import { DuplicateType, FiltersType } from "../types/duplicate";

export const toNumber = (value: unknown): number => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const filterDuplicates = (
  data: DuplicateType[],
  filters: FiltersType
): DuplicateType[] => {
  return data.filter((item: DuplicateType) => {
    const matchesStatus =
      !filters.status || item.status === filters.status;

    const matchesDate = (() => {
      if (!filters.date) return true;

      const selected = new Date(filters.date);
      const due = new Date(item.due_date);

      if (filters.mode === "month") {
        return (
          selected.getMonth() === due.getMonth() &&
          selected.getFullYear() === due.getFullYear()
        );
      }

      // modo dia (default)
      return due.toISOString().slice(0, 10) === filters.date;
    })();

    return matchesStatus && matchesDate;
  });
};

export const calculateTotalValue = (filteredData: DuplicateType[]): number => {
  return filteredData.reduce((acc, item) => acc + toNumber(item.value), 0);
};

export const getUpcomingDuplicates = (data: DuplicateType[]): DuplicateType[] => {
  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  return data.filter((item: DuplicateType) => {
    const due = new Date(item.due_date);
    return due >= today && due <= next7Days;
  });
};

export const getDuplicateAlerts = (data: DuplicateType[]): DuplicateType[] => {
  return data.filter((item: DuplicateType) => {
    const due = new Date(item.due_date);
    const now = new Date();

    const start = new Date();
    start.setHours(0, 0, 0, 0); // início do dia

    const end = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const isPendingOrDelayed =
      item.status === "pending" || item.status === "delayed";

    return (
      isPendingOrDelayed &&
      due.getTime() >= start.getTime() &&
      due.getTime() <= end.getTime()
    );
  });
};

export const calculateAlertValue = (alerts: DuplicateType[]): number => {
  return alerts.reduce((acc, item) => acc + toNumber(item.value), 0);
};
