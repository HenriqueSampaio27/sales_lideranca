import React from "react";
import { Edit, Trash2, Mail, Phone, FileText, MapPin } from "lucide-react";
import { Client } from "../../types/client";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "../ui";
import { colors, borderRadius, typography } from "../../theme";

interface ClientTableProps {
  currentClients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({
  currentClients,
  onEdit,
  onDelete,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead className="hidden md:table-cell">Documento</TableHead>
          <TableHead className="hidden sm:table-cell">Contato</TableHead>
          <TableHead className="hidden lg:table-cell">Endereço</TableHead>
          <TableHead align="center">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentClients.length === 0 ? (
          <TableRow>
            <TableCell align="center" className="py-12 text-slate-500">
              Nenhum cliente cadastrado ou encontrado na busca.
            </TableCell>
          </TableRow>
        ) : (
          currentClients.map((clientItem) => (
            <TableRow key={clientItem.id}>
              {/* Cliente */}
              <TableCell>
                <div className="flex flex-col">
                  <span
                    style={{
                      color: colors.textPrimary,
                      fontWeight: typography.fontWeight.bold,
                      fontSize: typography.fontSize.sm,
                    }}
                    className="hover:text-amber-600 transition-colors"
                  >
                    {clientItem.name}
                  </span>
                  <span
                    style={{
                      color: colors.textSecondary,
                      fontSize: typography.fontSize.xs,
                    }}
                    className="mt-0.5"
                  >
                    Desde {clientItem.created_at ? new Date(clientItem.created_at).toLocaleDateString("pt-BR") : "—"}
                  </span>
                </div>
              </TableCell>

              {/* Documento (CPF/CNPJ) */}
              <TableCell className="hidden md:table-cell">
                {clientItem.cnpj_cpf ? (
                  <span
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: borderRadius.md,
                      color: colors.textPrimary,
                      fontFamily: typography.fontFamily.mono.join(", "),
                      fontSize: typography.fontSize.xs,
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1"
                  >
                    <FileText
                      style={{ color: colors.textSecondary }}
                      className="w-3.5 h-3.5"
                    />
                    {clientItem.cnpj_cpf}
                  </span>
                ) : (
                  <span
                    style={{ color: colors.textSecondary }}
                    className="text-xs italic"
                  >
                    Sem documento
                  </span>
                )}
              </TableCell>

              {/* Contato (Telefone + Email) */}
              <TableCell className="hidden sm:table-cell">
                <div className="flex flex-col gap-1 text-xs">
                  {clientItem.phone && (
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{clientItem.phone}</span>
                    </div>
                  )}
                  {clientItem.email && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{clientItem.email}</span>
                    </div>
                  )}
                  {!clientItem.phone && !clientItem.email && (
                    <span style={{ color: colors.textSecondary }} className="italic">
                      Sem contato
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Endereço */}
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-start gap-1.5 text-xs text-slate-600 max-w-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>
                    {[clientItem.logradouro, clientItem.number, clientItem.district, clientItem.city]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
                </div>
              </TableCell>

              {/* Ações */}
              <TableCell align="center">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => onEdit(clientItem)}
                    title="Editar cliente"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="danger"
                    size="xs"
                    onClick={() => onDelete(clientItem.id)}
                    title="Deletar cliente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ClientTable;
