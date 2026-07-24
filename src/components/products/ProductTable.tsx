import React from "react";
import fotoPadrao from "../../assets/padrao.jpeg";
import { Product } from "../../types/product";
import ProductStatusBadge from "./ProductStatusBadge";
import { colors, borderRadius, typography, spacing, shadows } from "../../theme";

interface ProductTableProps {
  currentProducts: Product[];
  base: string;
  formatMoney: (value: number) => string;
  handleEdit: (prod: Product) => void;
  handleDelete: (id: string) => void;
  handleToggleStatus?: (id: string, active: boolean) => void;
}

interface ProductTableRowProps {
  prod: Product;
  base: string;
  formatMoney: (value: number) => string;
  handleEdit: (prod: Product) => void;
  handleDelete: (id: string) => void;
  handleToggleStatus?: (id: string, active: boolean) => void;
}

const ProductTableRow = React.memo<ProductTableRowProps>(
  ({
    prod,
    base,
    formatMoney,
    handleEdit,
    handleDelete,
    handleToggleStatus,
  }) => {
    return (
      <tr className="hover:bg-slate-50/80 transition-colors duration-150 group">
        <td style={{ padding: spacing.md }}>
          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: colors.cardSecondary,
                borderColor: colors.border,
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: borderRadius.xl,
              }}
              className="size-10 overflow-hidden flex-shrink-0"
            >
              <img
                src={prod.image ? `${base}${prod.image}` : fotoPadrao}
                alt={prod.product_name}
                className="size-full object-contain p-1"
                onError={(
                  e: React.SyntheticEvent<HTMLImageElement, Event>
                ) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fotoPadrao;
                }}
              />
            </div>
            <span
              style={{
                color: colors.textPrimary,
                fontFamily: typography.fontFamily.sans.join(", "),
                fontWeight: typography.fontWeight.semibold,
              }}
              className="group-hover:text-amber-600 transition-colors"
            >
              {prod.product_name}
            </span>
          </div>
        </td>
        <td style={{ padding: spacing.md }}>
          <span
            style={{
              backgroundColor: colors.cardSecondary,
              borderColor: colors.border,
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: borderRadius.md,
              color: colors.textSecondary,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.medium,
              fontFamily: typography.fontFamily.sans.join(", "),
            }}
            className="px-2.5 py-1"
          >
            {prod.mark || "—"}
          </span>
        </td>
        <td
          style={{
            padding: spacing.md,
            color: colors.textPrimary,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.bold,
            fontFamily: typography.fontFamily.sans.join(", "),
          }}
        >
          R$ {formatMoney(Number(prod.sale_price))}
        </td>
        <td
          style={{
            padding: spacing.md,
            color: colors.textPrimary,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.extrabold,
            fontFamily: typography.fontFamily.sans.join(", "),
          }}
        >
          {Number(prod.stock)}
        </td>
        <td style={{ padding: spacing.md }}>
          <ProductStatusBadge
            active={prod.active === true}
            onToggle={() => handleToggleStatus?.(prod.id, prod.active)}
          />
        </td>

        <td style={{ padding: spacing.md }} className="text-right">
          <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-all">
            <button
              onClick={() => handleEdit(prod)}
              title="Editar produto"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: borderRadius.md,
                color: colors.textSecondary,
                boxShadow: shadows.sm,
              }}
              className="p-1.5 hover:text-amber-600 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                edit
              </span>
            </button>
            <button
              onClick={() => handleDelete(prod.id)}
              title="Excluir produto"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: borderRadius.md,
                color: colors.textSecondary,
                boxShadow: shadows.sm,
              }}
              className="p-1.5 hover:text-red-600 hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                delete
              </span>
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

ProductTableRow.displayName = "ProductTableRow";

const ProductTable: React.FC<ProductTableProps> = ({
  currentProducts,
  base,
  formatMoney,
  handleEdit,
  handleDelete,
  handleToggleStatus,
}) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderBottomWidth: "1px",
            borderBottomStyle: "solid",
            color: colors.textSecondary,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.semibold,
            fontFamily: typography.fontFamily.sans.join(", "),
          }}
          className="uppercase tracking-wider"
        >
          <tr>
            <th style={{ padding: spacing.md }}>Produto</th>
            <th style={{ padding: spacing.md }}>Marca</th>
            <th style={{ padding: spacing.md }}>Preço</th>
            <th style={{ padding: spacing.md }}>Qnt</th>
            <th style={{ padding: spacing.md }}>Status</th>
            <th style={{ padding: spacing.md }} className="text-right">Ações</th>
          </tr>
        </thead>
        <tbody
          style={{
            fontSize: typography.fontSize.sm,
            fontFamily: typography.fontFamily.sans.join(", "),
          }}
          className="divide-y divide-slate-200/80"
        >
          {currentProducts.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                style={{ padding: spacing.xl, color: colors.textSecondary }}
                className="text-center"
              >
                Nenhum produto encontrado.
              </td>
            </tr>
          ) : (
            currentProducts.map((prod: Product) => (
              <ProductTableRow
                key={prod.id}
                prod={prod}
                base={base}
                formatMoney={formatMoney}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleToggleStatus={handleToggleStatus}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(ProductTable);

