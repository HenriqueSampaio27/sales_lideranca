import React from "react";
import { Product, ProductFormData } from "../../types/product";
import { colors, borderRadius, typography, spacing, shadows, animations } from "../../theme";

interface ProductModalProps {
  product: ProductFormData;
  setProduct: React.Dispatch<React.SetStateAction<ProductFormData>>;
  editingProduct: Product | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  preview: string | null;
  setImage: (file: File | null) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  product,
  setProduct,
  fileInputRef,
  preview,
  setImage,
  handleImageChange,
}) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: borderRadius["2xl"],
    padding: spacing.md,
    boxShadow: shadows.sm,
    fontFamily: typography.fontFamily.sans.join(", "),
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: borderRadius.xl,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.sans.join(", "),
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    transition: animations.transitionNormal,
  };

  const labelStyle: React.CSSProperties = {
    color: colors.textPrimary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    fontFamily: typography.fontFamily.sans.join(", "),
    marginBottom: spacing.xs,
    display: "block",
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.textPrimary,
              marginBottom: spacing.md,
            }}
            className="flex items-center gap-2.5 tracking-tight"
          >
            <span
              style={{ color: colors.primary }}
              className="material-symbols-outlined"
            >
              info
            </span>
            Informações Gerais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label style={labelStyle}>Nome do Produto</label>
              <input
                value={product.product_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, product_name: e.target.value.toUpperCase() })
                }
                style={inputStyle}
                className="w-full px-4 py-3 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="Ex: Caixa monofásica"
                type="text"
              />
            </div>
            <div>
              <label style={labelStyle}>Marca</label>
              <input
                value={product.mark}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, mark: e.target.value.toUpperCase() })
                }
                style={inputStyle}
                className="w-full px-4 py-3 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="Krona"
                type="text"
              />
            </div>
            <div>
              <label style={labelStyle}>Código SKU</label>
              <input
                value={product.sku}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, sku: e.target.value })
                }
                style={{ ...inputStyle, fontFamily: typography.fontFamily.mono.join(", ") }}
                className="w-full px-4 py-3 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="SKU-00000"
                type="text"
              />
            </div>
            <div>
              <label style={labelStyle}>EAN (Código de Barras)</label>
              <div className="relative">
                <input
                  value={product.barcode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProduct({ ...product, barcode: e.target.value })
                  }
                  style={{ ...inputStyle, fontFamily: typography.fontFamily.mono.join(", ") }}
                  className="w-full pl-4 pr-10 py-3 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  placeholder="7890000000000"
                  type="text"
                />
                <span
                  style={{ color: colors.textSecondary }}
                  className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-lg"
                >
                  barcode_scanner
                </span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Unidade</label>
              <select
                value={product.unit}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const text = e.target.options[e.target.selectedIndex].text;
                  setProduct({ ...product, unit: text });
                }}
                style={inputStyle}
                className="w-full px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              >
                <option value="UN">UN</option>
                <option value="KG">KG</option>
                <option value="M">M</option>
                <option value="CX">CX</option>
                <option value="PCT">PCT</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Estoque</label>
              <input
                value={product.stock}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, stock: e.target.value })
                }
                style={inputStyle}
                className="w-full px-4 py-3 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="Ex: 0"
                type="text"
              />
            </div>
            <div>
              <label style={labelStyle}>Estoque Mínimo</label>
              <input
                value={product.minStock}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setProduct({ ...product, minStock: e.target.value })
                }
                style={inputStyle}
                className="w-full px-4 py-3 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="Ex: 0"
                type="text"
              />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.textPrimary,
              marginBottom: spacing.md,
            }}
            className="flex items-center gap-2.5 tracking-tight"
          >
            <span
              style={{ color: colors.primary }}
              className="material-symbols-outlined"
            >
              payments
            </span>
            Precificação e Custos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label style={labelStyle}>Preço de Venda</label>
              <div className="relative">
                <span
                  style={{ color: colors.textSecondary }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm"
                >
                  R$
                </span>
                <input
                  value={product.sale_price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProduct({ ...product, sale_price: e.target.value })
                  }
                  style={inputStyle}
                  className="w-full pl-11 pr-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  placeholder="0,00"
                  type="number"
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Preço de Custo</label>
              <div className="relative">
                <span
                  style={{ color: colors.textSecondary }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm"
                >
                  R$
                </span>
                <input
                  value={product.price_cost}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProduct({ ...product, price_cost: e.target.value })
                  }
                  style={inputStyle}
                  className="w-full pl-11 pr-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  placeholder="0,00"
                  type="number"
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Desconto Máximo</label>
              <div className="relative">
                <span
                  style={{ color: colors.textSecondary }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm"
                >
                  %
                </span>
                <input
                  value={product.discount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProduct({ ...product, discount: e.target.value })
                  }
                  style={inputStyle}
                  className="w-full pl-11 pr-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  placeholder="0.00"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 h-full flex flex-col">
        <div
          onClick={() => fileInputRef.current?.click()}
          style={cardStyle}
          className="flex flex-col flex-1 cursor-pointer hover:border-slate-300 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setImage(e.target.files?.[0] || null);
              handleImageChange(e);
            }}
          />

          <h3
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.bold,
              color: colors.textPrimary,
              marginBottom: spacing.md,
            }}
            className="flex items-center gap-2.5 tracking-tight"
          >
            <span
              style={{ color: colors.primary }}
              className="material-symbols-outlined"
            >
              image
            </span>
            Mídia do Produto
          </h3>

          <div
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderRadius: borderRadius["2xl"],
              borderWidth: "2px",
              borderStyle: "dashed",
              padding: spacing.lg,
            }}
            className="flex-1 flex flex-col items-center justify-center text-center hover:border-amber-500/50 transition-all group"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={{ borderRadius: borderRadius.xl }}
                className="max-h-64 object-contain"
              />
            ) : (
              <>
                <div
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderRadius: borderRadius.full,
                    boxShadow: shadows.sm,
                  }}
                  className="size-16 flex items-center justify-center mb-4 group-hover:border-amber-500/50 group-hover:scale-105 transition-all"
                >
                  <span
                    style={{ color: colors.textSecondary }}
                    className="material-symbols-outlined text-3xl group-hover:text-amber-600 transition-colors"
                  >
                    upload_file
                  </span>
                </div>

                <p
                  style={{
                    color: colors.textPrimary,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.bold,
                  }}
                >
                  Clique para enviar imagem
                </p>
                <p
                  style={{
                    color: colors.textSecondary,
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.medium,
                  }}
                  className="mt-1"
                >
                  ou arraste o arquivo aqui
                </p>
                <p
                  style={{
                    color: colors.textSecondary,
                    fontSize: "10px",
                    fontWeight: typography.fontWeight.semibold,
                  }}
                  className="mt-4 uppercase tracking-wider"
                >
                  PNG, JPG até 5MB
                </p>
              </>
            )}
          </div>

          <div
            style={{
              backgroundColor: colors.primaryLight,
              borderColor: "#FDE68A",
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: borderRadius.xl,
              padding: spacing.md,
              marginTop: spacing.md,
            }}
          >
            <p
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.medium,
              }}
              className="leading-relaxed italic"
            >
              "As imagens devem ter fundo branco preferencialmente para o catálogo digital do{" "}
              <span style={{ color: colors.primary, fontWeight: typography.fontWeight.bold }}>
                Liderança Construções
              </span>."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(ProductModal);

