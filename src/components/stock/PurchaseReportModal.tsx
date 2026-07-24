import React from "react";
import { Check, FileText, ShoppingCart } from "lucide-react";
import { Modal, Button, Input, Badge } from "../ui";
import { Product, SelectedProduct } from "../../types/stock";
import { colors, borderRadius, typography, spacing, shadows, animations } from "../../theme";

interface PurchaseReportModalProps {
  showReportModal: boolean;
  setShowReportModal: (show: boolean) => void;
  products: Product[];
  selectedProducts: SelectedProduct[];
  toggleProduct: (product: Product) => void;
  updateRequestQty: (id: number, qty: string) => void;
  updateRequestUnit: (id: number, unit: string) => void;
  generateStockReport: (items: SelectedProduct[]) => void;
}

const PurchaseReportModal: React.FC<PurchaseReportModalProps> = ({
  showReportModal,
  setShowReportModal,
  products,
  selectedProducts,
  toggleProduct,
  updateRequestQty,
  updateRequestUnit,
  generateStockReport,
}) => {
  const filteredItems = products.filter(
    (p) => p.active && Number(p.stock) <= Number(p.minStock)
  );

  const modalTitle = (
    <h2
      style={{
        color: colors.textPrimary,
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className="tracking-tight flex items-center gap-2"
    >
      Lista de Compras
      <Badge variant="warning" size="sm">
        {filteredItems.length} itens necessitando reposição
      </Badge>
    </h2>
  );

  const modalFooter = (
    <>
      <div className="flex items-center gap-3">
        <div className="text-left">
          <p
            style={{
              color: colors.textSecondary,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.medium,
            }}
            className="uppercase tracking-wider"
          >
            Produtos Selecionados
          </p>
          <p
            style={{
              color: colors.textPrimary,
              fontSize: typography.fontSize["2xl"],
              fontWeight: typography.fontWeight.extrabold,
            }}
          >
            {selectedProducts.length}{" "}
            <span
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.normal,
              }}
            >
              item(s)
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Button
          variant="secondary"
          size="md"
          onClick={() => setShowReportModal(false)}
          className="flex-1 sm:flex-none"
        >
          Cancelar
        </Button>

        <Button
          variant="primary"
          size="md"
          disabled={selectedProducts.length === 0}
          onClick={() => generateStockReport(selectedProducts)}
          icon={<FileText className="w-4 h-4" />}
          className="flex-1 sm:flex-none"
        >
          Gerar Relatório PDF
        </Button>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={showReportModal}
      onClose={() => setShowReportModal(false)}
      title={modalTitle}
      subtitle="Selecione os produtos e ajuste as quantidades e unidades desejadas para a ordem de compra."
      icon={<ShoppingCart className="w-6 h-6" />}
      footer={modalFooter}
      maxWidth="5xl"
    >
      {/* CABEÇALHO DA TABELA */}
      <div
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
          color: colors.textSecondary,
          fontFamily: typography.fontFamily.sans.join(", "),
        }}
        className="grid grid-cols-[1.6fr_100px_100px_130px_120px_80px] px-6 py-3 border-b text-[11px] uppercase tracking-wider font-semibold"
      >
        <span>Produto</span>
        <span className="text-center">Atual</span>
        <span className="text-center">Mínimo</span>
        <span className="text-center">Qtd. Pedido</span>
        <span className="text-center">Unidade</span>
        <span className="text-center">Incluir</span>
      </div>

      {/* LISTA DE ITENS */}
      <div
        style={{ borderColor: colors.border }}
        className="divide-y divide-slate-200/80"
      >
        {filteredItems.length === 0 ? (
          <div
            style={{ color: colors.textSecondary }}
            className="p-12 text-center"
          >
            Nenhum produto necessitando de reposição no momento.
          </div>
        ) : (
          filteredItems.map((prod) => {
            const selectedProduct = selectedProducts.find(
              (p) => p.id === prod.id
            );
            const selected = !!selectedProduct;

            return (
              <div
                key={prod.id}
                style={{
                  backgroundColor: selected ? colors.primaryLight : "transparent",
                  transition: animations.transitionNormal,
                }}
                className={`grid grid-cols-[1.6fr_100px_100px_130px_120px_80px] items-center px-6 py-4 ${
                  !selected ? "hover:bg-slate-50/80" : ""
                }`}
              >
                {/* PRODUTO */}
                <div>
                  <p
                    style={{
                      color: colors.textPrimary,
                      fontWeight: typography.fontWeight.semibold,
                      fontSize: typography.fontSize.sm,
                    }}
                  >
                    {prod.product_name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      style={{ color: colors.textSecondary }}
                      className="text-[11px]"
                    >
                      Marca:
                    </span>
                    <span
                      style={{
                        color: colors.textPrimary,
                        fontWeight: typography.fontWeight.medium,
                      }}
                      className="text-[11px]"
                    >
                      {prod.mark || "—"}
                    </span>
                  </div>
                </div>

                {/* ESTOQUE ATUAL */}
                <div className="text-center">
                  <span
                    style={{
                      color: colors.error,
                      fontWeight: typography.fontWeight.extrabold,
                      fontSize: typography.fontSize.sm,
                    }}
                  >
                    {prod.stock}
                  </span>
                </div>

                {/* ESTOQUE MÍNIMO */}
                <div className="text-center">
                  <span
                    style={{
                      color: colors.textSecondary,
                      fontWeight: typography.fontWeight.medium,
                      fontSize: typography.fontSize.sm,
                    }}
                  >
                    {prod.minStock}
                  </span>
                </div>

                {/* QUANTIDADE PEDIDO */}
                <div className="px-2">
                  <Input
                    type="number"
                    min={1}
                    value={selectedProduct?.requestQty || ""}
                    onChange={(e) =>
                      updateRequestQty(prod.id, e.target.value)
                    }
                    placeholder="0"
                    disabled={!selected}
                    className="text-center font-bold !py-1.5"
                  />
                </div>

                {/* UNIDADE */}
                <div className="px-2">
                  <Input
                    type="text"
                    maxLength={10}
                    placeholder="UN"
                    value={selectedProduct?.requestUnit || ""}
                    onChange={(e) =>
                      updateRequestUnit(prod.id, e.target.value.toUpperCase())
                    }
                    disabled={!selected}
                    className="text-center font-bold uppercase !py-1.5"
                  />
                </div>

                {/* CHECKBOX BUTTON */}
                <div className="flex justify-center">
                  <button
                    onClick={() => toggleProduct(prod)}
                    style={{
                      backgroundColor: selected ? colors.primary : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: borderRadius.xl,
                      color: selected ? colors.textPrimary : "transparent",
                      boxShadow: selected ? shadows.glowPrimary : shadows.sm,
                      transition: animations.transitionNormal,
                    }}
                    className="w-8 h-8 flex items-center justify-center"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Modal>
  );
};

export default PurchaseReportModal;

