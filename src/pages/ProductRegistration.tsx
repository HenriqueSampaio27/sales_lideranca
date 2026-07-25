import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { baseUrl } from "../services/AuthService";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "../services/productService";
import { Product, ProductFormData } from "../types/product";
import ProductFilters from "../components/products/ProductFilters";
import ProductTable from "../components/products/ProductTable";
import ProductPagination from "../components/products/ProductPagination";
import ProductModal from "../components/products/ProductModal";
import { colors, borderRadius, typography, spacing, shadows, animations } from "../theme";

const initialProduct: ProductFormData = {
  id: "",
  product_name: "",
  barcode: "",
  sale_price: "",
  price_cost: "",
  stock: "",
  unit: "UN",
  sku: "",
  mark: "",
  image: "",
  minStock: "",
  discount: "",
};

function parseMoney(value: string | number): number {
  if (typeof value === "number") return value;
  if (!value) return 0;

  if (value.includes(".") && !value.includes(",")) {
    return parseFloat(value);
  }

  const normalized = value
    .replace(/\./g, "")
    .replace(",", ".");

  return parseFloat(normalized);
}

const ProductRegistration: React.FC = () => {
  const topRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const itemsPerPage: number = 20;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setImagePreview] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const base: string = baseUrl;

  const [product, setProduct] = useState<ProductFormData>(initialProduct);

  const clearFields = useCallback((): void => {
    setEditingProduct(null);
    setProduct(initialProduct);
  }, []);

  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      const data: Product[] = await getProducts();
      const sortedData: Product[] = [...data].sort((a: Product, b: Product) =>
        a.product_name.localeCompare(b.product_name, "pt-BR", { sensitivity: "base" })
      );
      setProducts(sortedData);
    } catch (error: unknown) {
      console.error(error);
      window.alert("banco dormindo!");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const calcPriceCost = useCallback((): void => {
    const sale = parseMoney(product.sale_price);

    if (!sale || sale <= 0) return;

    const cost = sale - sale * 0.375;

    setProduct((prev: ProductFormData) => ({
      ...prev,
      price_cost: cost.toFixed(2),
    }));
  }, [product.sale_price]);

  useEffect(() => {
    calcPriceCost();
  }, [product.sale_price, calcPriceCost]);

  const formatMoney = useCallback((value: number): string => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const formData = new FormData();
    const productToSend = {
      ...product,
      sale_price: parseMoney(product.sale_price),
      price_cost: parseMoney(product.price_cost),
    };

    formData.append("product_name", product.product_name || "");
    formData.append("barcode", product.barcode || "");
    formData.append("sale_price", String(productToSend.sale_price || 0));
    formData.append("price_cost", String(productToSend.price_cost || 0));
    formData.append("stock", String(product.stock || 0));
    formData.append("unit", product.unit || "UN");
    formData.append("mark", product.mark || "");
    formData.append("sku", product.sku || "");
    formData.append("discount", product.discount || "10");
    formData.append("minStock", String(product.minStock || 0));

    if (image) {
      formData.append("image", image);
    }

    try {
      if (editingProduct) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }

      setEditingProduct(null);
      setProduct(initialProduct);
      setImagePreview(null);
      setPreview(null);

      await fetchProducts();
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error: unknown) {
      console.error("Erro detalhado:", error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Erro desconhecido");
      }
    }
  }, [product, image, editingProduct, fetchProducts]);

  const handleEdit = useCallback((prod: Product): void => {
    setEditingProduct(prod);
    setProduct({
      id: String(prod.id ?? ""),
      product_name: prod.product_name || "",
      barcode: prod.barcode || "",
      sale_price: String(prod.sale_price ?? ""),
      price_cost: String(prod.price_cost ?? ""),
      stock: String(prod.stock ?? ""),
      unit: prod.unit || "UN",
      sku: prod.sku || "",
      mark: prod.mark || "",
      image: prod.image || "",
      minStock: String(prod.minStock ?? ""),
      discount: prod.discount || "",
    });

    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    if (!window.confirm("Tem certeza que deseja deletar?")) return;

    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (error: unknown) {
      console.error("Erro ao deletar produto:", error);
    }
  }, [fetchProducts]);

  const handleToggleStatus = useCallback(async (id: string, currentStatus: boolean): Promise<void> => {
    try {
      await toggleProductStatus(id, !currentStatus);
      await fetchProducts();
    } catch (error: unknown) {
      console.error("Erro ao alterar status do produto:", error);
    }
  }, [fetchProducts]);

  const filteredProducts: Product[] = useMemo(() => {
    const term = search.toLowerCase();
    return products.filter(
      (prod: Product) =>
        prod.product_name.toLowerCase().includes(term) ||
        prod.barcode?.toLowerCase().includes(term)
    );
  }, [products, search]);

  const indexOfLast: number = currentPage * itemsPerPage;
  const indexOfFirst: number = indexOfLast - itemsPerPage;

  const currentProducts: Product[] = useMemo(() => {
    return filteredProducts.slice(indexOfFirst, indexOfLast);
  }, [filteredProducts, indexOfFirst, indexOfLast]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      setImagePreview(file);
      setPreview(URL.createObjectURL(file));
    }
  }, []);

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 selection:bg-amber-500/20 selection:text-amber-800"
      ref={topRef}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
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
              <span style={{ color: colors.primary }} className="material-symbols-outlined text-sm">
                inventory_2
              </span>
              <span>Liderança Construções</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic mb-2" style={{ color: colors.textPrimary }}>
              cadastro de <span style={{ color: colors.primary }}>produtos</span>
            </h1>
            <p
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.sm,
              }}
              className="mt-1 font-normal max-w-2xl"
            >
              Gerencie o inventário de varejo e novos cadastros corporativos.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={clearFields}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: borderRadius.xl,
                color: colors.textPrimary,
                boxShadow: shadows.sm,
                transition: animations.transitionNormal,
              }}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold hover:bg-slate-50"
            >
              {editingProduct ? 'Cancelar Edição' : 'Limpar'}
            </button>
            <button
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => { handleSubmit(e); }}
              style={{
                backgroundColor: colors.primary,
                color: colors.textPrimary,
                borderRadius: borderRadius.xl,
                boxShadow: shadows.glowPrimary,
                transition: animations.transitionNormal,
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              {editingProduct ? 'Atualizar Produto' : 'Salvar Produto'}
            </button>
          </div>
        </div>

        {/* Product Registration / Edit Form */}
        <ProductModal
          product={product}
          setProduct={setProduct}
          editingProduct={editingProduct}
          fileInputRef={fileInputRef}
          preview={preview}
          setImage={setImage}
          handleImageChange={handleImageChange}
        />

        {/* Product List */}
        <section className="space-y-4">
          <ProductFilters
            search={search}
            setSearch={setSearch}
            setCurrentPage={setCurrentPage}
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
            <ProductTable
              currentProducts={currentProducts}
              base={base}
              formatMoney={formatMoney}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              handleToggleStatus={handleToggleStatus}
            />
            <ProductPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              indexOfFirst={indexOfFirst}
              indexOfLast={indexOfLast}
              totalProducts={filteredProducts.length}
            />
          </div>
        </section>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-[200]">
          <div
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderLeftColor: colors.primary,
              borderLeftWidth: "4px",
              borderWidth: "1px",
              borderStyle: "solid",
              borderRadius: borderRadius["2xl"],
              boxShadow: shadows.xl,
              padding: spacing.md,
            }}
            className="flex items-center gap-4 min-w-[320px]"
          >
            <div
              style={{
                backgroundColor: colors.primaryLight,
                borderColor: "#FDE68A",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: borderRadius.full,
              }}
              className="size-10 flex items-center justify-center"
            >
              <span
                style={{ color: colors.primary }}
                className="material-symbols-outlined text-2xl font-black"
              >
                check_circle
              </span>
            </div>
            <div>
              <p
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.bold,
                }}
              >
                Pronto!
              </p>
              <p
                style={{
                  color: colors.textSecondary,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.medium,
                }}
              >
                Operação realizada com sucesso.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              style={{ color: colors.textSecondary }}
              className="ml-auto hover:text-slate-600 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRegistration;

