import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Invoice } from "../types/finance";
import { financeService } from "../services/financeService";
import {
  filterNotes,
  calculatePendingNotDue,
  calculateDueToday,
  calculateOverdue,
  calculateOverduePercentage,
} from "../utils/financeUtils";
import {
  handlePrintCupom,
  handlePrintCupomConsolidado,
} from "../utils/financePrinter";

import FinanceHeader from "../components/finance/FinanceHeader";
import FinanceCards from "../components/finance/FinanceCards";
import FinanceFilters from "../components/finance/FinanceFilters";
import FinanceTable from "../components/finance/FinanceTable";
import FinancePagination from "../components/finance/FinancePagination";
import PaymentModal from "../components/finance/PaymentModal";

import { colors, typography, borderRadius, shadows } from "../theme";

const FinanceManagement: React.FC = () => {
  const [notes, setNotes] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedNote, setSelectedNote] = useState<Invoice | null>(null);
  const [paymentValue, setPaymentValue] = useState<string>("");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const fetchFinancialNotes = useCallback(async (): Promise<void> => {
    try {
      const data = await financeService.getFinancialNotes();
      setNotes(data);
    } catch (error: unknown) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchFinancialNotes();
  }, [fetchFinancialNotes]);

  // Filtered notes using useMemo
  const filteredNotes = useMemo(() => {
    return filterNotes(notes, searchTerm, statusFilter, dateFilter, today);
  }, [notes, searchTerm, statusFilter, dateFilter, today]);

  // Pagination slice using useMemo
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentNotes = useMemo(() => {
    return filteredNotes.slice(indexOfFirst, indexOfLast);
  }, [filteredNotes, indexOfFirst, indexOfLast]);

  // Statistics using useMemo
  const pendingNotDue = useMemo(
    () => calculatePendingNotDue(filteredNotes, today),
    [filteredNotes, today]
  );

  const dueToday = useMemo(
    () => calculateDueToday(filteredNotes, today),
    [filteredNotes, today]
  );

  const overdue = useMemo(
    () => calculateOverdue(filteredNotes, today),
    [filteredNotes, today]
  );

  const overduePercentage = useMemo(
    () => calculateOverduePercentage(notes, today),
    [notes, today]
  );

  // Handlers wrapped in useCallback
  const handlePayment = useCallback(async (): Promise<void> => {
    if (!selectedNote) return;

    try {
      await financeService.payInvoice(selectedNote.id, Number(paymentValue));
      setIsPaymentModalOpen(false);
      setPaymentValue("");
      setSelectedNote(null);
      await fetchFinancialNotes();
    } catch (error: unknown) {
      console.error("Erro ao registrar pagamento:", error);
    }
  }, [selectedNote, paymentValue, fetchFinancialNotes]);

  const handleDelete = useCallback(
    async (id: number): Promise<void> => {
      const confirmDelete = window.confirm(
        "Tem certeza que deseja excluir esta nota?"
      );
      if (!confirmDelete) return;

      try {
        await financeService.deleteInvoice(id);
        await fetchFinancialNotes();
      } catch (error: unknown) {
        console.error("Erro ao deletar nota:", error);
      }
    },
    [fetchFinancialNotes]
  );

  const handleOpenDanfe = useCallback((invoiceId: number): void => {
    const url = financeService.getDanfeUrl(invoiceId);
    window.open(url, "_blank");
  }, []);

  const handlePrintCupomSingle = useCallback(
    (invoiceId: number): void => {
      const noteToPrint = notes.find((inv) => inv.id === invoiceId);
      if (!noteToPrint) {
        alert("Nota não encontrada");
        return;
      }
      handlePrintCupom(noteToPrint);
    },
    [notes]
  );

  const handleEmitCupomConsolidado = useCallback((): void => {
    handlePrintCupomConsolidado(filteredNotes);
  }, [filteredNotes]);

  const handleOpenPaymentModal = useCallback((note: Invoice): void => {
    setSelectedNote(note);
    setIsPaymentModalOpen(true);
  }, []);

  const handleClosePaymentModal = useCallback((): void => {
    setIsPaymentModalOpen(false);
    setSelectedNote(null);
    setPaymentValue("");
  }, []);

  const handleExportReport = useCallback((): void => {
    alert("Exportação de relatório financeiro iniciada!");
  }, []);

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6"
    >
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleClosePaymentModal}
        selectedNote={selectedNote}
        paymentValue={paymentValue}
        setPaymentValue={setPaymentValue}
        onConfirmPayment={handlePayment}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        <FinanceHeader
          onExport={handleExportReport}
          onEmitCupomConsolidado={handleEmitCupomConsolidado}
        />

        <FinanceCards
          pendingNotDue={pendingNotDue}
          dueToday={dueToday}
          overdue={overdue}
          overduePercentage={overduePercentage}
        />

        <FinanceFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          onRefresh={fetchFinancialNotes}
        />

        <div
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: borderRadius["2xl"],
            boxShadow: shadows.sm,
          }}
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <FinanceTable
            currentNotes={currentNotes}
            onOpenPaymentModal={handleOpenPaymentModal}
            onOpenDanfe={handleOpenDanfe}
            onPrintCupom={handlePrintCupomSingle}
            onDeleteNote={handleDelete}
          />
          <FinancePagination
            currentPage={currentPage}
            totalItems={filteredNotes.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default FinanceManagement;
