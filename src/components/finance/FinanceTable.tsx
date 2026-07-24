import React from "react";
import {
  CreditCard,
  FileText,
  Printer,
  Bell,
  Trash2,
  DollarSign,
} from "lucide-react";
import { Invoice } from "../../types/finance";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Button,
} from "../ui";
import { colors, borderRadius, typography } from "../../theme";

interface FinanceTableProps {
  currentNotes: Invoice[];
  onOpenPaymentModal: (note: Invoice) => void;
  onOpenDanfe: (invoiceId: number) => void;
  onPrintCupom: (invoiceId: number) => void;
  onDeleteNote: (id: number) => void;
}

export const FinanceTable: React.FC<FinanceTableProps> = ({
  currentNotes,
  onOpenPaymentModal,
  onOpenDanfe,
  onPrintCupom,
  onDeleteNote,
}) => {
  const renderStatusBadge = (note: Invoice) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = note.due_date ? new Date(note.due_date) : null;
    if (dueDate) dueDate.setHours(0, 0, 0, 0);

    if (note.status === "PAGO") {
      return (
        <Badge
          variant="success"
          icon={<span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
        >
          Pago
        </Badge>
      );
    } else if (note.status === "PENDENTE") {
      if (dueDate && dueDate < today) {
        return (
          <Badge
            variant="error"
            icon={
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            }
          >
            Vencido
          </Badge>
        );
      } else {
        return (
          <Badge
            variant="warning"
            icon={<span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
          >
            A Vencer
          </Badge>
        );
      }
    }
    return null;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID / Nº Nota</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead className="hidden sm:table-cell">Valor Original</TableHead>
          <TableHead>Saldo Devedor</TableHead>
          <TableHead className="hidden md:table-cell">Vencimento</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentNotes.length === 0 ? (
          <TableRow>
            <TableCell align="center" className="py-12 text-slate-500">
              Nenhuma nota financeira encontrada.
            </TableCell>
          </TableRow>
        ) : (
          currentNotes.map((note) => {
            const pendingAmount =
              note.status === "PENDENTE"
                ? Number(note.total_amount ?? 0) - Number(note.total_paid ?? 0)
                : 0;

            return (
              <TableRow key={note.id}>
                {/* ID / Nº Nota */}
                <TableCell>
                  <span
                    style={{
                      color: colors.primary,
                      fontFamily: typography.fontFamily.mono.join(", "),
                      fontWeight: typography.fontWeight.bold,
                      fontSize: typography.fontSize.xs,
                    }}
                  >
                    #{note.invoice_number || note.id}
                  </span>
                </TableCell>

                {/* Cliente */}
                <TableCell>
                  <div className="flex flex-col">
                    <span
                      style={{
                        color: colors.textPrimary,
                        fontWeight: typography.fontWeight.bold,
                        fontSize: typography.fontSize.sm,
                      }}
                    >
                      {note.customer_name}
                    </span>
                    <span
                      style={{
                        color: colors.textSecondary,
                        fontSize: typography.fontSize.xs,
                      }}
                      className="mt-0.5"
                    >
                      {note.cnpj_cpf || "Sem documento"}
                    </span>
                  </div>
                </TableCell>

                {/* Valor Original */}
                <TableCell className="hidden sm:table-cell font-medium">
                  {Number(note.total_amount || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>

                {/* Saldo Devedor */}
                <TableCell>
                  <span
                    style={{
                      color:
                        note.status === "PENDENTE"
                          ? colors.error
                          : note.status === "PAGO"
                          ? colors.success
                          : colors.textPrimary,
                      fontWeight: typography.fontWeight.bold,
                    }}
                  >
                    {note.status === "PENDENTE"
                      ? pendingAmount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                      : "R$ 0,00"}
                  </span>
                </TableCell>

                {/* Vencimento */}
                <TableCell className="hidden md:table-cell text-xs text-slate-600">
                  {note.due_date
                    ? new Date(note.due_date).toLocaleDateString("pt-BR")
                    : "—"}
                </TableCell>

                {/* Status */}
                <TableCell>{renderStatusBadge(note)}</TableCell>

                {/* Ações */}
                <TableCell align="center">
                  <div className="flex items-center justify-center gap-1.5">
                    {note.status !== "PAGO" && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onOpenPaymentModal(note)}
                        title="Registrar Pagamento"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onOpenDanfe(note.id)}
                      title="Gerar DANFE / Detalhes"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onPrintCupom(note.id)}
                      title="Cupom térmico"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => alert(`Lembrete enviado para ${note.customer_name}`)}
                      title="Enviar Lembrete"
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDeleteNote(note.id)}
                      title="Excluir Nota"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default FinanceTable;
