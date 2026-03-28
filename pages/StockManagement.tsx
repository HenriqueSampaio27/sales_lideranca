import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { baseUrl } from "../services/AuthService"

const StockManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const base = baseUrl
  const [outOfStockSize, setOutOfStockSize] = useState(0);
  const [belowMinimumSize, setBelowMinimumSize] = useState(0);
  
  useEffect(() => {
    fetchProducts();
    const result = checkStockStatus(products);
    
  }, [products]);

  const toggleActive = async (prod: any) => {
    try {
      const updated = { ...prod, active: !prod.active };

      await fetch(`SEU_BACKEND/product/${prod.id}/active`, {
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

  function generateStockReport(products: any[]) {
    const doc = new jsPDF();

    const activeProducts = products.filter((p) => p.active === true);
    const outOfStock = activeProducts.filter(
      (p) => Number(p.stock) === 0
    );

    const belowMinimum = activeProducts.filter(
      (p) =>
        Number(p.stock) > 0 &&
        Number(p.stock) <= Number(p.minStock)
    );

    const allCritical = [...outOfStock, ...belowMinimum];

    if (allCritical.length === 0) {
      alert("Nenhum produto crítico encontrado.");
      return;
    }

    const tableData = allCritical.map((p) => [
      p.product_name,
      p.mark,
      p.stock,
      p.minStock,
      Number(p.stock) === 0 ? "ZERADO" : "ABAIXO DO MÍNIMO",
    ]);

    doc.setFontSize(16);
    doc.text("Relatório de Produtos Críticos", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Produto", "Marca", "Qtd Atual", "Estoque Mínimo", "Status"]],
      body: tableData,
    });

    doc.save("relatorio-estoque-critico.pdf");
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

  // 📄 Paginação
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-8 space-y-8">

      {/* 🔎 BUSCA */}
      <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
       <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border-dark pb-8">
         <div>
           <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Gestão de <span className="text-primary">Estoque</span></h2>
           <p className="text-slate-500 mt-1 font-medium uppercase tracking-[0.1em] text-xs">Controle logístico, reposição e movimentação de mercadorias.</p>
         </div>
         <div className="flex gap-4">
            <button onClick={() => generateStockReport(products)} className="flex items-center gap-2 bg-primary text-background-dark px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/10">
              <span className="material-symbols-outlined text-lg">sync_alt</span>
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