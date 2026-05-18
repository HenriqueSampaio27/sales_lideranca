import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { baseUrl } from "../services/AuthService"
import { Database } from "lucide-react";
import { motion } from 'motion/react';

const StockManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const base = baseUrl
  const [outOfStockSize, setOutOfStockSize] = useState(0);
  const [belowMinimumSize, setBelowMinimumSize] = useState(0);
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    checkStockStatus(products);
  }, [products]);

  const toggleActive = async (prod: any) => {
    try {
      const updated = { ...prod, active: !prod.active };

      await fetch(`${base}/product/${prod.id}/active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !prod.active }),
      });

      // Atualiza na tela sem recarregar
      setProducts((prev: any) =>
        prev.map((p: any) =>
          p.id === prod.id ? { ...p, active: !p.active } : p
        )
      );

    } catch (err) {
      console.error("Erro ao atualizar active", err);
    }
  };

  function checkStockStatus(products: any[]) {
    const outOfStock: any[] = [];
    const belowMinimum: any[] = [];

    const activeProducts = products.filter((p) => p.active === true);

    activeProducts.forEach((prod) => {
      const stock = Number(prod.stock);
      const minStock = Number(prod.minStock);
      if (stock === 0) {
        outOfStock.push(prod);
      } else if (stock > 0 && stock <= minStock) {
        belowMinimum.push(prod);
      }
    });

    setBelowMinimumSize(belowMinimum.length)
    setOutOfStockSize(outOfStock.length)

    return {
      outOfStock,
      belowMinimum,
    };
  }

  function openReportModal() {
    const activeProducts = products.filter(
      (p) => p.active === true
    );

    const criticalProducts = activeProducts
      .filter(
        (p) =>
          Number(p.stock) <=
          Number(p.minStock)
      )
      .map((p) => ({
        ...p,
        requestQty:
          Number(p.minStock) -
          Number(p.stock) +
          1,
        requestUnit: "UN",
      }));

    if (criticalProducts.length === 0) {
      alert("Nenhum produto crítico encontrado.");
      return;
    }

    setSelectedProducts(criticalProducts);
    setShowReportModal(true);
  }

  function generateStockReport(selected: any[]) {
    const doc = new jsPDF();

    if (selected.length === 0) {
      alert("Selecione pelo menos um item.");
      return;
    }

    const tableData = selected.map((p) => [
      p.product_name,
      p.mark,
      p.requestQty,
      p.requestUnit
    ]);

    doc.setFontSize(16);
    doc.text("Lista de compras", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [[
        "Produto",
        "Marca",
        "Quantidade",
        "Unidade"
      ]],
      body: tableData,
    });

    doc.save("relatorio-estoque-critico.pdf");

    setShowReportModal(false);
  }

  function toggleProduct(prod: any) {
    setSelectedProducts((prev) => {
      const exists = prev.some(
        (p) => p.id === prod.id
      );

      if (exists) {
        return prev.filter(
          (p) => p.id !== prod.id
        );
      }

      return [
        ...prev,
        {
          ...prod,
          requestQty:
            Number(prod.minStock) -
            Number(prod.stock) +
            1,
          requestUnit: "UN",
        },
      ];
    });
  }

  function updateRequestUnit(
    productId: number,
    value: string
  ) {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              requestUnit: value,
            }
          : p
      )
    );
  }

  function updateRequestQty(
    productId: number,
    value: string
  ) {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              requestQty: Number(value),
            }
          : p
      )
    );
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${base}/product`);

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }

      const data = await response.json();

      const sortedData = data.sort((a: any, b: any) =>
        a.product_name.localeCompare(b.product_name, "pt-BR", {
          sensitivity: "base",
        })
      );

      setProducts(sortedData);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔎 Filtro por nome OU código de barras
  const filteredProducts = products.filter((prod: any) =>
    prod.product_name.toLowerCase().includes(search.toLowerCase()) ||
    prod.barcode?.toLowerCase().includes(search.toLowerCase())
    );

  async function handleBackup() {
    try {
      setLoadingBackup(true);

      const res = await fetch(`${base}/backup`);

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `backup-${new Date().toISOString().slice(0, 10)}.sql`;
      
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Erro ao gerar backup");
    } finally {
      setLoadingBackup(false);
    }
  }

  // 📄 Paginação
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-8 space-y-8">
  
      {showReportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-dark border border-border-dark rounded-[2rem] w-full max-w-5xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)]"
          >
            {/* HEADER */}
            <div className="p-6 border-b border-border-dark flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-white uppercase italic">
                  Lista de Compras
                </h2>

                <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">
                  Escolha os itens, quantidade e unidade do pedido
                </p>
              </div>

              <button
                onClick={() => setShowReportModal(false)}
                className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 text-slate-400 hover:text-white transition-all flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* CABEÇALHO */}
            <div className="grid grid-cols-[1.6fr_110px_110px_130px_130px_80px] px-6 py-4 border-b border-border-dark text-[10px] uppercase tracking-widest font-black text-slate-500 bg-black/20">
              <span>Produto</span>
              <span className="text-center">
                Atual
              </span>
              <span className="text-center">
                Min.
              </span>
              <span className="text-center">
                Quantidade
              </span>
              <span className="text-center">
                Unidade
              </span>
              <span className="text-center">
                Incluir
              </span>
            </div>

            {/* LISTA */}
            <div className="max-h-[500px] overflow-y-auto">
              {products
                .filter(
                  (p) =>
                    p.active &&
                    Number(p.stock) <=
                      Number(p.minStock)
                )
                .map((prod) => {
                  const selectedProduct =
                    selectedProducts.find(
                      (p) => p.id === prod.id
                    );

                  const selected =
                    !!selectedProduct;

                  return (
                    <div
                      key={prod.id}
                      className="grid grid-cols-[1.6fr_110px_110px_130px_130px_80px] items-center gap-4 px-6 py-5 border-b border-border-dark hover:bg-white/[0.03] transition-all"
                    >
                      {/* PRODUTO */}
                      <div>
                        <p className="text-white font-bold text-sm">
                          {prod.product_name}
                        </p>

                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] text-slate-500 uppercase">
                            Marca:
                          </span>

                          <span className="text-[10px] text-slate-400 font-bold">
                            {prod.mark}
                          </span>
                        </div>
                      </div>

                      {/* ESTOQUE */}
                      <div className="text-center">
                        <span className="font-black text-lg text-rose-500">
                          {prod.stock}
                        </span>
                      </div>

                      {/* MÍNIMO */}
                      <div className="text-center">
                        <span className="font-bold text-slate-300">
                          {prod.minStock}
                        </span>
                      </div>

                      {/* QUANTIDADE */}
                      <div>
                        <input
                          type="number"
                          min={1}
                          disabled={!selected}
                          value={
                            selectedProduct?.requestQty ||
                            ""
                          }
                          onChange={(e) =>
                            updateRequestQty(
                              prod.id,
                              e.target.value
                            )
                          }
                          className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-2 text-white text-center font-bold outline-none focus:ring-2 focus:ring-primary disabled:opacity-40"
                        />
                      </div>

                      {/* UNIDADE */}
                      <div>
                        <input
                          type="text"
                          maxLength={10}
                          disabled={!selected}
                          placeholder="UN"
                          value={
                            selectedProduct?.requestUnit ||
                            ""
                          }
                          onChange={(e) =>
                            updateRequestUnit(
                              prod.id,
                              e.target.value.toUpperCase()
                            )
                          }
                          className="w-full bg-background-dark border border-border-dark rounded-xl px-4 py-2 text-white text-center font-bold uppercase outline-none focus:ring-2 focus:ring-primary disabled:opacity-40"
                        />
                      </div>

                      {/* CHECK */}
                      <div className="flex justify-center">
                        <button
                          onClick={() =>
                            toggleProduct(prod)
                          }
                          className={`w-7 h-7 rounded-lg border transition-all flex items-center justify-center ${
                            selected
                              ? "bg-primary border-primary text-black"
                              : "border-border-dark bg-background-dark text-transparent"
                          }`}
                        >
                          ✓
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* FOOTER */}
            <div className="p-6 border-t border-border-dark flex items-center justify-between bg-black/10">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                  Produtos Selecionados
                </p>

                <p className="text-2xl font-black text-white">
                  {selectedProducts.length}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setShowReportModal(false)
                  }
                  className="px-6 py-3 rounded-xl border border-border-dark text-slate-400 font-bold hover:border-slate-600 transition-all"
                >
                  Cancelar
                </button>

                <button
                  onClick={() =>
                    generateStockReport(
                      selectedProducts
                    )
                  }
                  className="bg-primary text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:brightness-110 transition-all"
                >
                  Gerar PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* 🔎 BUSCA */}
      <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border-dark pb-8">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Gestão de <span className="text-primary">Estoque</span></h2>
          <p className="text-slate-500 mt-1 font-medium uppercase tracking-[0.1em] text-xs">Controle logístico, reposição e movimentação de mercadorias.</p>
        </div>
        <div className="flex gap-4">
            <motion.button 
              onClick={handleBackup}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="bg-surface-dark/80 backdrop-blur-md border border-border-dark p-4 rounded-full shadow-2xl flex items-center gap-3 group hover:border-primary/50 transition-all"
            >
              <span className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg">
                <Database size={20} />
              </span>

              <span className="text-xs font-black text-white/90 pr-2 uppercase tracking-widest">
                {loadingBackup ? "Gerando..." : "Backup do Sistema"}
              </span>
            </motion.button>
            <button
              onClick={openReportModal}
              className="flex items-center gap-2 bg-primary text-background-dark px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/10"
            >
              <span className="material-symbols-outlined text-lg">
                sync_alt
              </span>
              Emitir nota
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { l: 'Itens em Falta', v: outOfStockSize, c: 'rose', i: 'production_quantity_limits' },
          { l: 'Reposição Necessária', v: belowMinimumSize, c: 'amber', i: 'order_approve' },
          { l: 'Giro de Estoque', v: '15.4x', c: 'emerald', i: 'autorenew' },
          { l: 'Perda/Quebra (Mês)', v: '0.4%', c: 'slate', i: 'dangerous' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-dark p-6 rounded-2xl border border-border-dark hover:border-primary/20 transition-all group">
            <div className={`size-12 rounded-xl bg-${stat.c}-500/10 text-${stat.c}-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <span className="material-symbols-outlined">{stat.i}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.l}</p>
            <p className="text-3xl font-black text-white">{stat.v}</p>
          </div>
        ))}
      </div>
      <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Buscar por nome ou código de barras..."
          className="bg-background-dark border border-border-dark rounded-xl px-4 py-2 text-white text-sm w-80 outline-none focus:ring-2 focus:ring-primary"
        />
      {/* 📋 TABELA */}
      <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                <th className="px-6 py-4">Produto</th>
                <th className="px-6 py-4">Código de Barras</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest">Marca</th>
                <th className="px-6 py-4 text-right">Qtd Atual</th>
                <th className="px-6 py-4 text-right">Estoque Mínimo</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border-dark">
              {currentProducts.map((prod: any) => (
                <tr key={prod.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-white font-bold">
                    {prod.product_name}
                  </td>

                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                    {prod.barcode}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-400">{prod.mark}</span>
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-bold ${
                      Number(prod.stock) <= Number(prod.minStock)
                        ? "text-rose-500"
                        : "text-white"
                    }`}
                  >
                    {prod.stock}
                  </td>

                  <td className="px-6 py-4 text-right text-slate-500">
                    {prod.minStock}
                  </td>
                      
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleActive(prod)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
                        prod.active ? "bg-green-500" : "bg-gray-500"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                          prod.active ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📄 PAGINAÇÃO */}
        <div className="px-6 py-4 border-t border-border-dark flex justify-between items-center">
          <span className="text-xs text-slate-500 font-bold">
            Exibindo {indexOfFirst + 1} -{" "}
            {Math.min(indexOfLast, filteredProducts.length)} de{" "}
            {filteredProducts.length}
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-1 text-xs font-bold border border-border-dark rounded-lg text-slate-400 disabled:opacity-30"
            >
              Anterior
            </button>

            <button className="px-4 py-1 text-xs font-bold bg-primary text-black rounded-lg">
              {currentPage}
            </button>

            <button
              disabled={indexOfLast >= filteredProducts.length}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-1 text-xs font-bold border border-border-dark rounded-lg text-slate-400 disabled:opacity-30"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
};

export default StockManagement;