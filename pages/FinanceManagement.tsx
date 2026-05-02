import React, { useEffect, useState } from 'react';
import { baseUrl } from "../services/AuthService"

const FinanceManagement: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const base = baseUrl
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [paymentValue, setPaymentValue] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formatCurrencyCompact = (value: number): string  => {
    const abs = Math.abs(value)

    // Até 999.999,99 → formato normal
    if (abs < 1_000_000) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    }

    // 1.000.000+ → milhões
    const millions = value / 1_000_000

    return `R$ ${millions.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}M`
  }
  const filteredNotes = notes.filter((note) => {

  // 🔎 FILTRO TEXTO (cliente ou documento ou número)
    const matchesSearch =
      note.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.cnpj_cpf?.includes(searchTerm) ||
      note.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // 📌 FILTRO STATUS (calculado por data)
    if (statusFilter) {
      const dueDate = note.due_date ? new Date(note.due_date) : null;
      if (dueDate) dueDate.setHours(0, 0, 0, 0);

      if (statusFilter === "vencido") {
        if (!(note.status === "PENDENTE" && dueDate && dueDate < today)) return false;
      }

      if (statusFilter === "avencer") {
        if (!(note.status === "PENDENTE" && dueDate && dueDate >= today)) return false;
      }

      if (statusFilter === "parcial") {
        if (!(Number(note.total_paid) > 0 && note.status === "PENDENTE")) return false;
      }
    }

    // 📅 FILTRO DATA DA VENDA (issue_date)
    if (dateFilter) {
      const issueDateStr = note.issue_date.split('T')[0];
      const selectedDateStr = dateFilter;

      if (issueDateStr !== selectedDateStr) return false;
    }

    return true;
  });

  const pendingNotDue = filteredNotes.reduce((acc, item) => {
    if (item.status !== "PENDENTE") return acc;

    const dueDate = item.due_date ? new Date(item.due_date) : null;
    if (!dueDate) return acc;

    dueDate.setHours(0, 0, 0, 0);

    if (dueDate > today) {
      return acc + (Number(item.total_amount ?? 0) - Number(item.total_paid ?? 0));
    }

    return acc;
  }, 0);

  const dueToday = filteredNotes.reduce((acc, item) => {
    if (item.status !== "PENDENTE") return acc;

    const dueDate = item.due_date ? new Date(item.due_date) : null;
    if (!dueDate) return acc;

    dueDate.setHours(0, 0, 0, 0);

    if (dueDate.getTime() === today.getTime()) {
      return acc + (Number(item.total_amount ?? 0) - Number(item.total_paid ?? 0));
    }

    return acc;
  }, 0);

  const overdue = filteredNotes.reduce((acc, item) => {
    if (item.status !== "PENDENTE") return acc;

    const dueDate = item.due_date ? new Date(item.due_date) : null;
    if (!dueDate) return acc;

    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      return acc + (Number(item.total_amount ?? 0) - Number(item.total_paid ?? 0));
    }

    return acc;
  }, 0);

  const totalPendingCount = notes.filter(
    (item) => item.status === "PENDENTE"
  ).length;

  const overdueCount = notes.filter((item) => {
    if (item.status !== "PENDENTE") return false;

    const dueDate = item.due_date ? new Date(item.due_date) : null;
    if (!dueDate) return false;

    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }).length;

  const overduePercentage =
    totalPendingCount > 0
      ? ((overdueCount / totalPendingCount) * 100).toFixed(2)
      : 0;

    const fetchFinancialNotes = async () => {
      try {
        const response = await fetch(`${base}/financial-notes`);

        if (!response.ok) {
          throw new Error("Erro ao buscar notas");
        }

        const data = await response.json();

        setNotes(data);

      } catch (error) {
        console.error(error);
      }
    };
    console.log(notes)

const currentNotes = filteredNotes.slice(indexOfFirst, indexOfLast);

const handlePayment = async () => {
  if (!selectedNote) return;

  await fetch(`${base}/invoices/${selectedNote.id}/pay`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: Number(paymentValue),
    }),
  });

  setIsPaymentModalOpen(false);
  setPaymentValue("");
  fetchFinancialNotes(); // recarrega lista
};

const handleDelete = async (id: number) => {
  const confirmDelete = window.confirm("Tem certeza que deseja excluir esta nota?");

  if (!confirmDelete) return;

  await fetch(`${base}/invoices/${id}`, {
    method: "DELETE",
  });

  fetchFinancialNotes();
};

const handleOpenInvoicePDF = (invoiceId) => {
  window.open(`${base}/generate-danfe/${invoiceId}`, "_blank");
};

  const handlePrintCupom = async (invoiceId: number) => {
    try {
      const response = await fetch(`${base}/financial-notes`);
      const data = await response.json();

      const invoice = data.find((inv: any) => inv.id === invoiceId);

      if (!invoice) {
        alert("Nota não encontrada");
        return;
      }

      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      let value_sub = 0
      let value_disc = 0

      printWindow.document.write(`
        <html>
          <head>
            <title>Cupom</title>
            <style>
              @page {
                size: 80mm auto;
                margin: 0;
              }

              body {
                font-family: monospace;
                font-size: 12px;
                width: 80mm;
                margin: 0;
                padding: 5px;
                color: #000;
              }

              .center {
                text-align: center;
              }

              .line {
                border-top: 1px dashed #000;
                margin: 6px 0;
              }

              .item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 3px;
                font-size: 11px;
              }

              .total {
                font-weight: bold;
                font-size: 13px;
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
              }

              .small {
                font-size: 10px;
              }

              @media print {
                body {
                  width: 80mm;
                }
              }
            </style>
          </head>

          <body onload="window.print(); window.close();">

            <div class="center">
              <strong>LIDERANÇA CONSTRUÇÕES</strong><br/>
              CUPOM NÃO FISCAL
            </div>

            <div class="line"></div>

            <div class="small">
              Cliente: ${invoice.customer_name || "-"}<br/>
              Documento: ${invoice.cnpj_cpf || "-"}<br/>
              Data: ${new Date(invoice.issue_date).toLocaleString("pt-BR")}<br/>
              Nº: ${invoice.invoice_number}
            </div>

            <div class="line"></div>

            ${invoice.items
              .map(
                (item: any) => {
                  console.log(invoice.items)
                  console.log(item.discount_value)
                  value_disc += Number(item.discount_value);
                  value_sub += (Number(item.unit_price_original)*(item.quantity));
                  return `
                  <div>
                    <div class="item">
                      <span>${item.product_name}</span>
                      <span>${(Number(item.unit_price_original)* Number(item.quantity)).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}</span>
                    </div>
                    <div class="item">
                      <span>${item.quantity}UN x ${(Number(item.unit_price_original)).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}</span>
                    </div>
                    ${Number(item.discount_value) != 0 ? 
                      `<div class="item">
                        <span>Desconto</span>
                        <span>${Number(item.discount_value).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}</span>
                        </div>` : ""}
                  </div>
                `}
              )
              .join("")}

            <div class="line"></div>

            <div class="total">
              <span>SUBTOTAL</span>
              <span>${Number(value_sub).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}</span>
            </div>
            ${value_disc != 0 ? `<div class="total">
              <span>DESCONTO</span>
              <span>${Number(value_disc).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}</span>
            </div>` : ""}
            <div class="total">
              <span>TOTAL</span>
              <span>${Number(invoice.total_amount).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}</span>
            </div>

            <div class="line"></div>

            <div class="center small">
              Obrigado pela preferência!
            </div>

          </body>
        </html>
      `);

      printWindow.document.close();
    } catch (error) {
      console.error("Erro ao imprimir cupom:", error);
    }
  };

  const handlePrintCupomConsolidado = () => {
    const notesToPrint = filteredNotes.filter(note => note.status !== "PAGO");

    if (notesToPrint.length === 0) {
      alert("Nenhuma nota pendente");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let value_sub = 0;
    let value_disc = 0;

    // 🔥 junta TODOS os itens de todas as notas
    const allItems = notesToPrint.flatMap(note => note.items || []);

    const itemsHTML = allItems.map((item: any) => {
      const itemTotal = Number(item.unit_price_original) * Number(item.quantity);

      value_sub += itemTotal;
      value_disc += Number(item.discount_value || 0);

      return `
        <div>
          <div class="item">
            <span>${item.product_name}</span>
            <span>${itemTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</span>
          </div>
          <div class="item">
            <span>${item.quantity}UN x ${(Number(item.unit_price_original)).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</span>
          </div>

          ${Number(item.discount_value) !== 0 ? `
            <div class="item">
              <span>Desconto</span>
              <span>${Number(item.discount_value).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}</span>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    const totalFinal = value_sub - value_disc;

    printWindow.document.write(`
      <html>
        <head>
          <title>Cupom Consolidado</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }

            body {
              font-family: monospace;
              font-size: 12px;
              width: 80mm;
              padding: 5px;
            }

            .center { text-align: center; }
            .line { border-top: 1px dashed #000; margin: 6px 0; }

            .item {
              display: flex;
              justify-content: space-between;
              font-size: 11px;
            }

            .total {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              margin-top: 6px;
            }

            .small { font-size: 10px; }
          </style>
        </head>

        <body onload="window.print(); window.close();">

          <!-- 🔥 CABEÇALHO ÚNICO -->
          <div class="center">
            <strong>LIDERANÇA CONSTRUÇÕES</strong><br/>
            CUPOM CONSOLIDADO
          </div>

          <div class="line"></div>

          <div class="small">
            Quantidade de notas: ${notesToPrint.length}<br/>
            Data: ${new Date().toLocaleString("pt-BR")}
          </div>

          <div class="line"></div>

          <!-- 🔥 TODOS OS ITENS -->
          ${itemsHTML}

          <div class="line"></div>

          <div class="total">
            <span>SUBTOTAL</span>
            <span>${value_sub.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</span>
          </div>

          ${value_disc !== 0 ? `
            <div class="total">
              <span>DESCONTO</span>
              <span>${value_disc.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}</span>
            </div>
          ` : ""}

          <div class="total">
            <span>TOTAL</span>
            <span>${totalFinal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</span>
          </div>

          <div class="line"></div>

          <div class="center small">
            Obrigado pela preferência!
          </div>

        </body>
      </html>
    `);

    printWindow.document.close();
  };

  useEffect(() => {
    fetchFinancialNotes();
  }, []);
  
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Notas</h2>
          <p className="text-slate-400 mt-1">Contas pagas, Contas a Receber e acompanhamento de cobranças.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-lg transition-all border border-white/10">
            <span className="material-symbols-outlined text-xl">download</span>
            <span className="text-sm font-bold">Exportar Relatório</span>
          </button>
          <button onClick={ () => handlePrintCupomConsolidado()} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-background-dark px-6 py-2.5 rounded-lg transition-all shadow-lg shadow-primary/10">
            <span className="material-symbols-outlined text-xl">note</span>
            <span className="text-sm font-bold">Emitir</span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-dark border border-white/5 p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Total Pendente</span>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black text-white tracking-tighter">{formatCurrencyCompact(pendingNotDue)}</span>
            
          </div>
        </div>

        <div className="bg-surface-dark border border-white/5 p-6 rounded-xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Vencidas Hoje</span>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">today</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black text-white tracking-tighter">{formatCurrencyCompact(dueToday)}</span>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-bold mt-3">
              <span></span>
            </div>
          </div>
        </div>

        <div className="bg-surface-dark border border-white/10 p-6 rounded-xl shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20 group-hover:bg-red-500 transition-colors"></div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Total em Atraso</span>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
              <span className="material-symbols-outlined">warning</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black text-red-400 tracking-tighter">{formatCurrencyCompact(overdue)}</span>
            <div className="flex items-center gap-1 text-red-500/70 text-xs font-bold mt-3">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>Crítico: {overduePercentage}% do total pendente</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-dark border border-white/5 rounded-xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
            <input value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-accent-dark border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Buscar por cliente, documento" type="text"/>
          </div>
          <div className="w-48 relative">
            <select  value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-accent-dark border border-white/10 rounded-lg pl-3 pr-10 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary appearance-none outline-none">
              <option value="">Todos os Status</option>
              <option value="avencer">A Vencer</option>
              <option value="vencido">Vencido</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
          </div>
          <div className="w-56 relative">
            <input 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)} className="w-full bg-accent-dark border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:ring-1 focus:ring-primary [color-scheme:dark] outline-none" type="date"/>
          </div>
          <button className="bg-accent-dark text-white border border-white/10 p-2.5 rounded-lg hover:bg-white/5 transition-all">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </section>

      <section className="bg-surface-dark border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-accent-dark/50 border-b border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="px-6 py-5">ID da Nota</th>
                <th className="px-6 py-5">Cliente</th>
                <th className="px-6 py-5">Valor Original</th>
                <th className="px-6 py-5">Saldo Devedor</th>
                <th className="px-6 py-5">Vencimento</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentNotes.map((note) => (
                <tr key={note.id} className="hover:bg-white/[0.02] transition-all group">
                  <td className="px-6 py-5 font-mono text-xs text-primary font-black uppercase">{note.id}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{note.customer_name}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-0.5">{note.cnpj_cpf}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-300">{Number(note.total_amount || 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}</td>
                  <td className={`px-6 py-5 text-sm font-black ${note.status === 'PENDENTE' ? 'text-red-500' : note.status === 'PAGO' ? 'text-green-500' : 'text-white'}`}>
                    {note.status === "PENDENTE"
                      ? (Number(note.total_amount ?? 0) - Number(note.total_paid ?? 0))
                          .toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                      : "R$ 0,00"
                      }

                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-400">{note.due_date 
                      ? new Date(note.due_date).toLocaleDateString("pt-BR")
                      : ""}</td>
                  <td className="px-6 py-5">
                    
                    {(() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      const dueDate = note.due_date ? new Date(note.due_date) : null;
                      if (dueDate) dueDate.setHours(0, 0, 0, 0);

                      let displayStatus = "";
                      let badgeStyle = "";
                      let dotStyle = "";

                      if (note.status === "PAGO") {
                        displayStatus = "Pago";
                        badgeStyle = "bg-green-500/10 text-green-400 border-green-500/20";
                        dotStyle = "bg-green-400";
                      } else if (note.status === "PENDENTE") {
                        if (dueDate && dueDate < today) {
                          displayStatus = "Vencido";
                          badgeStyle = "bg-red-500/10 text-red-500 border-red-500/20";
                          dotStyle = "bg-red-500 animate-pulse";
                        } else {
                          displayStatus = "A Vencer";
                          badgeStyle = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
                          dotStyle = "bg-yellow-400";
                        }
                      }

                      return (
                        <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[10px] font-black uppercase tracking-widest border ${badgeStyle}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`}></span>
                          {displayStatus}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      {note.status !== "PAGO" && (
                        <button 
                          onClick={() => {
                            setSelectedNote(note);
                            setIsPaymentModalOpen(true);
                          }}
                          className="p-2 bg-primary rounded-lg text-background-dark hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/10"
                          title="Registrar Pagamento"
                        >
                          <span className="material-symbols-outlined text-sm font-black">
                            payments
                          </span>
                        </button>
                      )}
    
                        <button 
                        onClick={() => handleOpenInvoicePDF(note.id)}
                        className="p-2 bg-accent-dark text-slate-400 rounded-lg hover:text-white transition-colors" title="Detalhes">
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>

                        <button
                          onClick={() => handlePrintCupom(note.id)}
                          className="p-2 bg-accent-dark text-slate-400 rounded-lg hover:text-primary transition-colors"
                          title="Cupom térmico"
                        >
                          <span className="material-symbols-outlined text-sm">
                            receipt_long
                          </span>
                        </button>

                        <button className="p-2 bg-accent-dark text-slate-400 rounded-lg hover:text-primary transition-colors" title="Enviar Lembrete">
                          <span className="material-symbols-outlined text-sm">notifications_active</span>
                        </button>
      
                      <button onClick={() => handleDelete(note.id)}
  className="p-2 bg-accent-dark text-red-500 rounded-lg hover:text-primary transition-colors"
  title="Excluir Nota"
>
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-white/5 bg-accent-dark/20 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Exibindo {indexOfFirst + 1 } - {Math.min(indexOfLast, filteredNotes.length)} de {filteredNotes.length} registros</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <button disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)} 
                className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border border-border-dark hover:bg-white/5 transition-all text-slate-500">Anterior</button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-primary text-background-dark rounded-lg">{currentPage}</button>
              <button disabled={indexOfLast >= filteredNotes.length}
                onClick={() => setCurrentPage(currentPage + 1)} 
                className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border border-border-dark hover:bg-white/5 transition-all text-slate-500">Próximo</button>
            </div>
          </div>
        </div>
      </section>
      {isPaymentModalOpen && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-surface-dark p-6 rounded-xl w-96 border border-white/10">
      
      <h2 className="text-lg font-bold mb-4 text-white">
        Registrar Pagamento
      </h2>

      <input
        type="number"
        placeholder="Digite o valor"
        value={paymentValue}
        onChange={(e) => setPaymentValue(e.target.value)}
        className="w-full bg-accent-dark border border-white/10 rounded-lg px-3 py-2 text-white mb-4 outline-none"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setIsPaymentModalOpen(false)}
          className="px-4 py-2 bg-accent-dark rounded-lg text-slate-400"
        >
          Cancelar
        </button>

        <button
          onClick={handlePayment}
          className="px-4 py-2 bg-primary rounded-lg text-background-dark font-bold"
        >
          Aprovar Pagamento
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default FinanceManagement;