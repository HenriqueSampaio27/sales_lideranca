import React from "react";
import { Product } from "../../types/stock";
import { Barcode, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
} from "../ui";
import { colors, borderRadius, typography, animations, shadows } from "../../theme";

interface StockTableProps {
  currentProducts: Product[];
  toggleActive: (prod: Product) => void;
}

const StockTable: React.FC<StockTableProps> = ({
  currentProducts,
  toggleActive,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Código de Barras</TableHead>
          <TableHead>Marca</TableHead>
          <TableHead align="right">Qtd. Atual</TableHead>
          <TableHead align="right">Estoque Mínimo</TableHead>
          <TableHead align="center">Status</TableHead>
          <TableHead align="right">Ativo</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {currentProducts.length === 0 ? (
          <TableRow>
            <TableCell align="center" className="py-12 text-slate-500">
              Nenhum produto encontrado.
            </TableCell>
          </TableRow>
        ) : (
          currentProducts.map((prod) => {
            const stockNum = Number(prod.stock);
            const minStockNum = Number(prod.minStock);
            const isOut = stockNum === 0;
            const isCritical = stockNum > 0 && stockNum <= minStockNum;

            return (
              <TableRow key={prod.id}>
                {/* Produto */}
                <TableCell>
                  <div
                    style={{
                      color: colors.textPrimary,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                    className="hover:text-amber-600 transition-colors"
                  >
                    {prod.product_name}
                  </div>
                </TableCell>

                {/* Código de Barras */}
                <TableCell>
                  {prod.barcode ? (
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
                      <Barcode
                        style={{ color: colors.textSecondary }}
                        className="w-3.5 h-3.5"
                      />
                      {prod.barcode}
                    </span>
                  ) : (
                    <span
                      style={{ color: colors.textSecondary }}
                      className="text-xs italic"
                    >
                      Sem código
                    </span>
                  )}
                </TableCell>

                {/* Marca */}
                <TableCell>
                  <span
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: borderRadius.md,
                      color: colors.textSecondary,
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.medium,
                    }}
                    className="px-2.5 py-1"
                  >
                    {prod.mark || "—"}
                  </span>
                </TableCell>

                {/* Qtd Atual */}
                <TableCell align="right">
                  <span
                    style={{
                      color: isOut
                        ? colors.error
                        : isCritical
                        ? colors.warning
                        : colors.textPrimary,
                      fontWeight: typography.fontWeight.extrabold,
                      fontSize: typography.fontSize.sm,
                    }}
                    className="inline-block"
                  >
                    {prod.stock}
                  </span>
                </TableCell>

                {/* Estoque Mínimo */}
                <TableCell
                  align="right"
                  style={{
                    color: colors.textSecondary,
                    fontWeight: typography.fontWeight.medium,
                  }}
                >
                  {prod.minStock}
                </TableCell>

                {/* Status Indicator */}
                <TableCell align="center">
                  {isOut ? (
                    <Badge variant="error" icon={<AlertCircle className="w-3 h-3" />}>
                      Esgotado
                    </Badge>
                  ) : isCritical ? (
                    <Badge variant="warning" icon={<AlertCircle className="w-3 h-3" />}>
                      Reposição
                    </Badge>
                  ) : (
                    <Badge variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
                      Regular
                    </Badge>
                  )}
                </TableCell>

                {/* Ativo Toggle */}
                <TableCell align="right">
                  <button
                    onClick={() => toggleActive(prod)}
                    title={prod.active ? "Desativar produto" : "Ativar produto"}
                    style={{
                      backgroundColor: prod.active ? colors.success : colors.border,
                      transition: animations.transitionNormal,
                    }}
                    className="relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    <span
                      style={{
                        backgroundColor: colors.card,
                        boxShadow: shadows.sm,
                        transition: animations.transitionNormal,
                      }}
                      className={`inline-block h-4 w-4 transform rounded-full ${
                        prod.active ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
};

export default StockTable;

