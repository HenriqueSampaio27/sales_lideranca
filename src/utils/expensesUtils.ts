import { ExpenseType, ExpenseFiltersType } from '../types/expenses';

export const toNumber = (value: unknown): number => {
  const n = Number(value);
  return isNaN(n) ? 0 : n;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.slice(0, 10).split('-');
  if (!year || !month || !day) return '';

    return `${day}/${month}/${year}`;
};

export const filterExpenses = (
  data: ExpenseType[],
  filters: ExpenseFiltersType
): ExpenseType[] => {
  return data.filter((item: ExpenseType) => {
    const matchesStatus = !filters.status || item.status === filters.status;

    const matchesCategory =
      !filters.category ||
      item.category.toLowerCase() === filters.category.toLowerCase();

    const matchesSearch =
      !filters.search ||
      item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.document.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.category.toLowerCase().includes(filters.search.toLowerCase());

    const itemDueDate = item.due_date || '';

    const matchesDate = (() => {
      if (!filters.date) return true;

      const selected = new Date(filters.date);
      const due = new Date(itemDueDate);

      if (isNaN(due.getTime())) return true;

      if (filters.mode === 'month') {
        return (
          selected.getMonth() === due.getMonth() &&
          selected.getFullYear() === due.getFullYear()
        );
      }

      return itemDueDate.slice(0, 10) === filters.date;
    })();

    return matchesStatus && matchesCategory && matchesSearch && matchesDate;
  });
};

export const calculateTotalExpenses = (filteredData: ExpenseType[]): number => {
  return filteredData.reduce((acc, item) => acc + toNumber(item.value), 0);
};

export const getUpcomingExpenses = (data: ExpenseType[]): ExpenseType[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);
  next7Days.setHours(23, 59, 59, 999);

  return data.filter((item: ExpenseType) => {
    const itemDueDate = item.due_date || item.due_date || '';
    const due = new Date(itemDueDate);
    return !isNaN(due.getTime()) && due >= today && due <= next7Days && item.status !== 'paid';
  });
};

export const getExpenseAlerts = (data: ExpenseType[]): ExpenseType[] => {
  const now = new Date();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfAlertWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return data.filter((item: ExpenseType) => {
    const itemDueDate = item.due_date || item.due_date || '';
    const due = new Date(itemDueDate);
    if (isNaN(due.getTime())) return false;

    const isPendingOrDelayed =
      item.status === 'pending' || item.status === 'delayed';

    return (
      isPendingOrDelayed &&
      due.getTime() >= startOfDay.getTime() &&
      due.getTime() <= endOfAlertWindow.getTime()
    );
  });
};

export const calculateAlertValue = (alerts: ExpenseType[]): number => {
  return alerts.reduce((acc, item) => acc + toNumber(item.value), 0);
};

export const calculateCategoryTotals = (data: ExpenseType[]): Record<string, number> => {
  return data.reduce((acc, item) => {
    const cat = item.category || 'Geral';
    acc[cat] = (acc[cat] || 0) + toNumber(item.value);
    return acc;
  }, {} as Record<string, number>);
};
