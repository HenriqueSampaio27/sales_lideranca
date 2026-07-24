import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { baseUrl } from "../services/AuthService";
import { Database, FileText, Layers } from "lucide-react";
import { motion } from "motion/react";

import {
  Product,
  SelectedProduct,
  StockFilter,
} from "../types/stock";

import StockCards from "../components/stock/StockCards";
import StockFilters from "../components/stock/StockFilters";
import StockTable from "../components/stock/StockTable";
import StockPagination from "../components/stock/StockPagination";
import PurchaseReportModal from "../components/stock/PurchaseReportModal";
import { Button } from "../components/ui";
import { colors, borderRadius, typography, shadows } from "../theme";

const StockManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loadingBackup, setLoadingBackup] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Filtros
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");

  // Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  // 1. CARREGAR PRODUTOS
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${baseUrl}/product`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  // TOGGLE ATIVO
  const toggleActive = async (prod: Product) => {
    try {
      const updatedProduct = { ...prod, active: !prod.active };
      const res = await fetch(`${baseUrl}/product/${prod.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? updatedProduct : p))
        );
      }
    } catch (err) {
      console.error("Erro ao alterar status:", err);
    }
  };

  // BACKUP
  const handleBackup = async () => {
    setLoadingBackup(true);
    try {
      const res = await fetch(`${baseUrl}/backup`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup_${new Date().toISOString().slice(0, 10)}.sql`;
        a.click();
      }
    } catch (err) {
      console.error("Erro ao gerar backup:", err);
    } finally {
      setLoadingBackup(false);
    }
  };

  // ABRIR MODAL COM PRODUTOS CRÍTICOS PRÉ-SELECIONADOS
  const openReportModal = () => {
    const critical = products.filter(
      (p) => p.active && Number(p.stock) <= Number(p.minStock)
    );

    const initialSelection: SelectedProduct[] = critical.map((p) => ({
      id: p.id,
      product_name: p.product_name,
      mark: p.mark,
      stock: p.stock,
      minStock: p.minStock,
      requestQty: String(
        Math.max(1, Number(p.minStock) * 2 - Number(p.stock))
      ),
      requestUnit: "UN",
    }));

    setSelectedProducts(initialSelection);
    setShowReportModal(true);
  };

  // MARCAR / DESMARCAR NO MODAL
  const toggleProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [
          ...prev,
          {
            id: product.id,
            product_name: product.product_name,
            mark: product.mark,
            stock: product.stock,
            minStock: product.minStock,
            requestQty: String(
              Math.max(1, Number(product.minStock) * 2 - Number(product.stock))
            ),
            requestUnit: "UN",
          },
        ];
      }
    });
  };

  const updateRequestQty = (id: number, qty: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, requestQty: qty } : p))
    );
  };

  const updateRequestUnit = (id: number, unit: string) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, requestUnit: unit } : p))
    );
  };

  // GERAR PDF
  const generateStockReport = (itemsToReport: SelectedProduct[]) => {
    const doc = new jsPDF();

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 20, "F");

    doc.setTextColor(217, 119, 6);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("LIDERANÇA CONSTRUÇÕES", 14, 13);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text("RELATÓRIO DE COMPRAS", 140, 13);

    doc.setTextColor(100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Data de emissão: ${new Date().toLocaleDateString("pt-BR")}`,
      14,
      28
    );

    const tableData = itemsToReport.map((p) => [
      p.product_name,
      p.mark || "N/A",
      p.stock,
      p.minStock,
      `${p.requestQty} ${p.requestUnit}`,
    ]);

    autoTable(doc, {
      startY: 33,
      head: [
        [
          "PRODUTO",
          "MARCA",
          "ESTOQUE ATUAL",
          "ESTOQUE MÍN.",
          "QTD. SOLICITADA",
        ],
      ],
      body: tableData,
      theme: "striped",
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [217, 119, 6],
        fontStyle: "bold",
      },
      styles: { fontSize: 8 },
    });

    doc.save(`lista_de_compras_${new Date().toISOString().slice(0, 10)}.pdf`);
    setShowReportModal(false);
  };

  // FILTRAGEM
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.toLowerCase().includes(search.toLowerCase());

    const stockNum = Number(p.stock);
    const minStockNum = Number(p.minStock);

    if (stockFilter === "out") {
      return matchSearch && stockNum === 0;
    }

    if (stockFilter === "minimum") {
      return matchSearch && stockNum <= minStockNum;
    }

    return matchSearch;
  });

  // MÉTRICAS
  const outOfStockSize = products.filter(
    (p) => p.active === true && Number(p.stock) === 0
  ).length;

  const belowMinimumSize = products.filter(
    (p) => p.active === true && (Number(p.stock) <= Number(p.minStock)) && (Number(p.stock) > 0) 
  ).length;

  // PAGINAÇÃO
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.textPrimary,
        fontFamily: typography.fontFamily.sans.join(", "),
      }}
      className="min-h-screen p-4 sm:p-6 lg:p-8 selection:bg-amber-500/20 selection:text-amber-800"
    >
      <PurchaseReportModal
        showReportModal={showReportModal}
        setShowReportModal={setShowReportModal}
        products={products}
        selectedProducts={selectedProducts}
        toggleProduct={toggleProduct}
        updateRequestQty={updateRequestQty}
        updateRequestUnit={updateRequestUnit}
        generateStockReport={generateStockReport}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 🔎 HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
              Gestão de <span style={{ color: colors.primary }}>Estoque</span>
            </h1>
            <p
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSize.sm,
              }}
              className="mt-1 font-normal max-w-2xl"
            >
              Controle logístico, reposição estratégica e inteligência de estoque de materiais da empresa.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="secondary"
              size="md"
              onClick={handleBackup}
              icon={<Database className="w-4 h-4 text-emerald-600" />}
            >
              {loadingBackup ? "Gerando..." : "Backup do Sistema"}
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={openReportModal}
              icon={<FileText className="w-4 h-4" />}
            >
              Lista de Compras
            </Button>
          </div>
        </motion.div>

        {/* METRICS CARDS */}
        <StockCards
          outOfStockSize={outOfStockSize}
          belowMinimumSize={belowMinimumSize}
        />

        {/* FILTERS AND SEARCH */}
        <StockFilters
          search={search}
          setSearch={setSearch}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          setCurrentPage={setCurrentPage}
          outOfStockSize={outOfStockSize}
          belowMinimumSize={belowMinimumSize}
        />

        {/* 📋 TABLE AND PAGINATION WRAPPER */}
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
          <StockTable
            currentProducts={currentProducts}
            toggleActive={toggleActive}
          />

          <StockPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            indexOfFirst={indexOfFirst}
            indexOfLast={indexOfLast}
            filteredProductsLength={filteredProducts.length}
          />
        </div>
      </div>
    </div>
  );
};

export default StockManagement;

