import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StockManagement: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const [outOfStockSize, setOutOfStockSize] = useState(0);
  const [belowMinimumSize, setBelowMinimumSize] = useState(0);
  
  useEffect(() => {
    fetchProducts();
    const result = checkStockStatus(products);
    
  }, [products]);

  function checkStockStatus(products: any[]) {
    const outOfStock: any[] = [];
    const belowMinimum: any[] = [];

    products.forEach((prod) => {
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

    const outOfStock = products.filter(
      (p) => Number(p.stock) === 0
    );

    const belowMinimum = products.filter(
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
      p.stock,
      p.minStock,
      Number(p.stock) === 0 ? "ZERADO" : "ABAIXO DO MÍNIMO",
    ]);

    doc.setFontSize(16);
    doc.text("Relatório de Produtos Críticos", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Produto", "Qtd Atual", "Estoque Mínimo", "Status"]],
      body: tableData,
    });

    doc.save("relatorio-estoque-critico.pdf");
  }


  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/product");

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

// import React from 'react';
// import { MOCK_PRODUCTS } from '../constants';

// const StockManagement: React.FC = () => {
  
  
  
//   return (
//     <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
//       <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border-dark pb-8">
//         <div>
//           <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Gestão de <span className="text-primary">Estoque</span></h2>
//           <p className="text-slate-500 mt-1 font-medium uppercase tracking-[0.1em] text-xs">Controle logístico, reposição e movimentação de mercadorias.</p>
//         </div>
//         <div className="flex gap-4">
//            <button className="flex items-center gap-2 bg-surface-dark border border-border-dark px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all shadow-xl">
//              <span className="material-symbols-outlined text-lg">local_shipping</span>
//              Entrada de NF
//            </button>
//            <button className="flex items-center gap-2 bg-primary text-background-dark px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/10">
//              <span className="material-symbols-outlined text-lg">sync_alt</span>
//              Nova Movimentação
//            </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {[
//           { l: 'Itens em Falta', v: '03', c: 'rose', i: 'production_quantity_limits' },
//           { l: 'Reposição Necessária', v: '12', c: 'amber', i: 'order_approve' },
//           { l: 'Giro de Estoque', v: '15.4x', c: 'emerald', i: 'autorenew' },
//           { l: 'Perda/Quebra (Mês)', v: '0.4%', c: 'slate', i: 'dangerous' },
//         ].map((stat, i) => (
//           <div key={i} className="bg-surface-dark p-6 rounded-2xl border border-border-dark hover:border-primary/20 transition-all group">
//             <div className={`size-12 rounded-xl bg-${stat.c}-500/10 text-${stat.c}-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
//               <span className="material-symbols-outlined">{stat.i}</span>
//             </div>
//             <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{stat.l}</p>
//             <p className="text-3xl font-black text-white">{stat.v}</p>
//           </div>
//         ))}
//       </div>

//       <div className="bg-surface-dark border border-border-dark rounded-3xl overflow-hidden shadow-2xl">
//         <div className="p-6 border-b border-border-dark flex flex-wrap items-center justify-between gap-6 bg-black/20">
//           <div className="flex items-center gap-4 bg-background-dark border border-border-dark px-4 py-2 rounded-2xl w-full max-w-lg focus-within:ring-2 focus-within:ring-primary transition-all">
//             <span className="material-symbols-outlined text-slate-500">search</span>
//             <input className="bg-transparent border-none text-sm text-white font-bold placeholder:text-slate-700 outline-none w-full" placeholder="Filtrar por nome, SKU ou localização..." />
//           </div>
//           <div className="flex items-center gap-2">
//             <button className="px-5 py-2.5 rounded-xl bg-primary text-background-dark font-black text-[10px] uppercase tracking-widest">Tudo</button>
//             <button className="px-5 py-2.5 rounded-xl bg-background-dark text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors border border-border-dark">Crítico</button>
//             <button className="px-5 py-2.5 rounded-xl bg-background-dark text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors border border-border-dark">Vencimento</button>
//           </div>
//         </div>

//         <div className="overflow-x-auto custom-scrollbar">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-black/30 border-b border-border-dark">
//                 <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest">Produto / SKU</th>
//                 <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest">Marca</th>
//                 <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Qtd Atual</th>
//                 <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Mínimo</th>
//                 <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest">Últ. Reposição</th>
//                 <th className="px-8 py-5 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Ações</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-border-dark/50">
//               {MOCK_PRODUCTS.map((prod) => (
//                 <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors group">
//                   <td className="px-8 py-6">
//                     <div className="flex flex-col">
//                       <span className="text-sm font-black text-white group-hover:text-primary transition-colors">{prod.name}</span>
//                       <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-widest mt-1">{prod.sku}</span>
//                     </div>
//                   </td>
//                   <td className="px-8 py-6">
//                       <span className="text-xs font-bold text-slate-400">{prod.location}</span>
//                   </td>
//                   <td className={`px-8 py-6 text-right font-black text-sm ${prod.quantity <= (prod.minQuantity || 0) ? 'text-rose-500' : 'text-white'}`}>
//                     {prod.quantity.toLocaleString()} un
//                   </td>
//                   <td className="px-8 py-6 text-right font-bold text-xs text-slate-500 italic">
//                     {prod.minQuantity} un
//                   </td>
//                   <td className="px-8 py-6">
//                     <span className="text-xs font-bold text-slate-500">{prod.lastRestock}</span>
//                   </td>
//                   <td className="px-8 py-6">
//                     <div className="flex items-center justify-center gap-2">
//                       <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-slate-600">
//                         <span className="material-symbols-outlined text-lg">history</span>
//                       </button>
//                       <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-slate-600">
//                         <span className="material-symbols-outlined text-lg">edit</span>
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockManagement;
