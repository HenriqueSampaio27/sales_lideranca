import React from "react";
import { Search, UserPlus, RefreshCw } from "lucide-react";
import { Input, Button } from "../ui";
import { colors, borderRadius, spacing, shadows, typography } from "../../theme";

interface ClientFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenModal: () => void;
  refreshClients: () => void;
}

const ClientFilters: React.FC<ClientFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  onOpenModal,
  refreshClients,
}) => {
  return (
    <div
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: borderRadius["2xl"],
        padding: spacing.md,
        boxShadow: shadows.sm,
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
    >
      {/* Search Input using UI Design System */}
      <div className="flex-1 max-w-md">
        <Input
          type="text"
          placeholder="Pesquisar por nome, CPF/CNPJ ou e-mail..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={refreshClients}
          title="Atualizar lista"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Atualizar</span>
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenModal}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </Button>
      </div>
    </div>
  );
};

export default ClientFilters;
