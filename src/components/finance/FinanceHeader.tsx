import React from "react";
import { Download, FileText, Layers } from "lucide-react";
import { Button } from "../ui";
import { colors, borderRadius, typography, shadows } from "../../theme";

interface FinanceHeaderProps {
  onExport: () => void;
  onEmitCupomConsolidado: () => void;
}

export const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  onExport,
  onEmitCupomConsolidado,
}) => {
  return (
    <div
      style={{ borderColor: colors.border }}
      className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 border-b pb-6"
    >
      <div>
        <div
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: "1px",
            borderStyle: "solid",
            borderRadius: borderRadius.full,
            color: colors.primary,
            boxShadow: shadows.sm,
          }}
          className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold mb-3"
        >
          <Layers style={{ color: colors.primary }} className="w-3.5 h-3.5" />
          <span>Liderança Construções</span>
        </div>
        <h1
          style={{
            fontSize: typography.fontSize["3xl"],
            fontWeight: typography.fontWeight.black,
            color: colors.textPrimary,
          }}
          className="tracking-tight"
        >
          Gestão <span style={{ color: colors.primary }}>Financeira</span>
        </h1>
        <p
          style={{
            color: colors.textSecondary,
            fontSize: typography.fontSize.sm,
          }}
          className="mt-1 font-normal max-w-2xl"
        >
          Contas pagas, Contas a Receber e acompanhamento de cobranças.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="md"
          onClick={onExport}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onEmitCupomConsolidado}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Emitir Cupom</span>
        </Button>
      </div>
    </div>
  );
};

export default FinanceHeader;
