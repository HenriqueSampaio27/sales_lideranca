import { Invoice } from "../types/finance";

export const formatCurrencyCompact = (value: number): string => {
  const abs = Math.abs(value);

  // Até 999.999,99 → formato normal
  if (abs < 1_000_000) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  // 1.000.000+ → milhões
  const millions = value / 1_000_000;

  return `R$ ${millions.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}M`;
};

export const filterNotes = (
  notes: Invoice[],
  searchTerm: string,
  statusFilter: string,
  dateFilter: string,
  today: Date
): Invoice[] => {
  return notes.filter((note) => {
    // 🔎 FILTRO TEXTO (cliente ou documento ou número)
    const matchesSearch =
      note.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.cnpj_cpf?.includes(searchTerm) ||
      note.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // 📌 FILTRO STATUS (calculado por data)
    if (statusFilter) {
      const dueDate = note.due_date ? new Date(note.due_date) : null;
      if (dueDate) dueDate.setHours(0, 0, 0, 0);

      if (statusFilter === "vencido") {
        if (!(note.status === "PENDENTE" && dueDate && dueDate < today)) return false;
      }

      if (statusFilter === "avencer") {
        if (!(note.status === "PENDENTE" && dueDate && dueDate >= today)) return false;
      }

      if (statusFilter === "parcial") {
        if (!(Number(note.total_paid) > 0 && note.status === "PENDENTE")) return false;
      }
    }

    // 📅 FILTRO DATA DA VENDA (issue_date)
    if (dateFilter) {
      const issueDateStr = note.issue_date.split("T")[0];
      const selectedDateStr = dateFilter;

      if (issueDateStr !== selectedDateStr) return false;
    }

    return true;
  });
};

export const calculatePendingNotDue = (notes: Invoice[], today: Date): number => {
  return notes.reduce((acc, item) => {
    if (item.status !== "PENDENTE") return acc;

    const dueDate = item.due_date ? new Date(item.due_date) : null;
    if (!dueDate) return acc;

    dueDate.setHours(0, 0, 0, 0);

    if (dueDate > today) {
      return acc + (Number(item.total_amount ?? 0) - Number(item.total_paid ?? 0));
    }

    return acc;
  }, 0);
};

export const calculateDueToday = (notes: Invoice[], today: Date): number => {
  return notes.reduce((acc, item) => {
    if (item.status !== "PENDENTE") return acc;

    const dueDate = item.due_date ? new Date(item.due_date) : null;
    if (!dueDate) return acc;

    dueDate.setHours(0, 0, 0, 0);

    if (dueDate.getTime() === today.getTime()) {
      return acc + (Number(item.total_amount ?? 0) - Number(item.total_paid ?? 0));
    }

    return acc;
  }, 0);
};

export const calculateOverdue = (notes: Invoice[], today: Date): number => {
  return notes.reduce((acc, item) => {
    if (item.status !== "PENDENTE") return acc;

    const dueDate = item.due_date ? new Date(item.due_date) : null;
    if (!dueDate) return acc;

    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      return acc + (Number(item.total_amount ?? 0) - Number(item.total_paid ?? 0));
    }

    return acc;
  }, 0);
};

export const calculateOverduePercentage = (
  notes: Invoice[],
  today: Date
): string | number => {
  const totalPendingCount = notes.filter(
    (item) => item.status === "PENDENTE"
  ).length;

  const overdueCount = notes.filter((item) => {
    if (item.status !== "PENDENTE") return false;

    const dueDate = item.due_date ? new Date(item.due_date) : null;
    if (!dueDate) return false;

    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }).length;

  return totalPendingCount > 0
    ? ((overdueCount / totalPendingCount) * 100).toFixed(2)
    : 0;
};
