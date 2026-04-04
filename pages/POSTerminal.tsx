import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { PaymentModal } from './PaymentModal';
import { PendingAccountModal } from './PendentModal';
import { baseUrl } from "../services/AuthService"

const POSTerminal: React.FC = () => {
  
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searchProduct, setSearchProduct] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [searchClient, setSearchClient] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempQty, setTempQty] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [cart, setCart] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);
  const [saleCompleted, setSaleCompleted] = useState(false);
  const [payments, setPayments] = useState<
    { method: string; amount: number }[]
  >([]);
  const [status, setStatus] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [invoiceID, setInvoiceID] = useState("")
  const base = baseUrl

  const fetchClients = async () => {
    const res = await fetch(`${base}/clients`);
    const data = await res.json();
    setClients(data);
    setFilteredClients(data);
  };

  const searchClientByDocument = async (doc: string) => {
    const res = await fetch(`${base}/clients`);
    const data = await res.json();

    const found = data.find(
      (c: any) => c.cnpj_cpf === doc
    );

    if (found) {
      setSelectedClient(found);
    } else {
      alert("Cliente não encontrado");
    }
  };

  const fetchProducts = async () => {
    const res = await fetch(`${base}/product`);
    const data = await res.json();
    const activeProducts = data.filter((p) => p.active === true);
      const sorted = activeProducts.sort((a, b) =>
      a.product_name.localeCompare(b.product_name)
    );

    setProducts(sorted);
    setFilteredProducts(sorted);  
  };

  const searchProductByBarcode = async (barcode: string) => {
    const res = await fetch(`${base}/product`);
    const data = await res.json();

    const found = data.find(
      (p: any) => p.barcode === barcode
    );

    if (found) {
      addProductToCart(found);
    } else {
      alert("Produto não encontrado");
    }
  };

  const addProductToCart = (product: any) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.product_name,
          sku: product.barcode,
          qty: 1,

          unit: Number(product.sale_price),

          maxDiscountPercent: Number(product.discount || 0), // desconto máximo permitido
          appliedDiscountPercent: 0, // (não aplica automaticamente)
        },
      ];
    });
  };

  const applyGlobalDiscount = (operatorPercent: number) => {
    if (operatorPercent < 0) return;

    setCart((prev) =>
      prev.map((item) => {
        const finalPercent = Math.min(
          operatorPercent,
          item.maxDiscountPercent
        );

        return {
          ...item,
          appliedDiscountPercent: finalPercent,
        };
      })
    );
  };

  const handleConfirmDiscount = () => {
    const percent = Number(discountInput);

    if (!isNaN(percent) && percent >= 0) {
      applyGlobalDiscount(percent);
    }

    setDiscountInput("");
    setIsDiscountModalOpen(false);
  };

  const clearGlobalDiscount = () => {
    setCart((prev) =>
      prev.map((item) => ({
        ...item,
        appliedDiscountPercent: 0,
      }))
    );
  };

  const getItemDiscountValue = (item: any) => {
  if (!item.appliedDiscountPercent) return 0;

  return (
      (item.appliedDiscountPercent / 100) *
      item.unit
    );
  };

  function exit(){
    if (
          !isClientModalOpen &&
          !isProductModalOpen &&
          !isPaymentModalOpen
        ) {
          navigate("/dashboard");
          return;
        }
  }

  const saveQty = (index: number) => {
    const qty = Number(tempQty);

    if (!qty || qty <= 0) {
      setEditingIndex(null);
      setTempQty("");
      return;
    }

    setCart(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, qty } : item
      )
    );

    setEditingIndex(null);
    setTempQty("");
  };

  const removeItem = (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;

    setCart(prev => prev.filter(item => item.id !== id));
  };

  const total = cart.reduce((acc, item) => {
    const discountValue = getItemDiscountValue(item);

    return acc + (item.unit - discountValue) * item.qty;
  }, 0);

  const discountTotal = cart.reduce((acc, item) => {
    const discountValue = getItemDiscountValue(item);

    return acc + (discountValue * item.qty);
  }, 0);

  const subTotal =  cart.reduce((acc, item) => acc + (item.qty * item.unit), 0);

  const handlePaymentConfirm = (paymentData: any) => {
    console.log("Pagamento recebido do modal:", paymentData);

    finalySave(true, paymentData, null); // 👈 envia para salvar no backend
  };

const finalySave = async (
  isPaid: boolean,
  paymentData: any | null,
  pendingInfo: { advanceAmount: number, dueDate: string } | null
) => {

  if (cart.length === 0) return;

  setIsSaving(true); // 🔄 começa loading

  const statusValue = isPaid ? "PAGO" : "PENDENTE";

  const items = cart.map((item) => ({
    product_id: item.id,
    quantity: item.qty,
    unit_price_original: item.unit,
    discount_value: getItemDiscountValue(item),
    unit_price_final: item.unit - getItemDiscountValue(item),
  }));

  try {
    const response = await fetch(`${base}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_id: selectedClient?.id || null,
        user_id: null,
        items,
        status: statusValue,
        is_paid: isPaid,
        payment_method: paymentData, // 🔹 pagamentos normais
        pending_info: isPaid ? null : pendingInfo // 🔹 conta pendente
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro do backend:", data);

      // 👇 mostra erro real
      alert(data.message || data.error || "Erro ao salvar venda");
      setIsSaving(false);
      return;
    }

    setCart([]);
    setPayments([]);
    setDiscount(0);
    setSelectedClient(null);

    const invoice = data.invoice_id;
      setSaleCompleted(true);
      setIsSaving(false);
      console.log("RESPOSTA BACKEND:", data);
      console.log("RESPOSTA BACKEND:", data.invoice_id);
      setInvoiceID(invoice)

  } catch (error) {
    console.error(error);
    alert("Erro na conexão com servidor");
    setIsSaving(false);
  }
};

  

  const pdf = () => {
    console.log(invoiceID)
    window.open(`${base}/generate-danfe/${invoiceID}`, "_blank");
  }

  const sendEmail = async () => {
    if (!invoiceID) return alert("Salve a venda primeiro");
    console.log("Invoice ID:", invoiceID);
    
    try {
      const response = await fetch(
        `${base}/invoices/${invoiceID}/send-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: selectedClient.email
          }),
        }
      );

      if (!response.ok) {
        alert("Erro ao enviar email");
        return;
      }

      alert("Email enviado com sucesso!");
    } catch (err) {
      console.log(err)
      alert("Erro na conexão com servidor");
    }
  };

  const sendWhatsApp = () => {
    if (!invoiceID) return alert("Salve a venda primeiro");

    if (!selectedClient?.phone) {
      return alert("Cliente não possui telefone cadastrado");
    }

    const numero = selectedClient.phone.replace(/\D/g, "");

    const linkPDF = `${base}/generate-danfe/${invoiceID}`;

    const mensagem = `Olá! Segue sua nota:\n${linkPDF}`;

    const url = `https://wa.me/55${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
  };
  
    // 
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    
    updateTime(); // executa na primeira vez

    const interval = setInterval(updateTime, 1000);
    

    const handleKeyDown = (e: KeyboardEvent) => {

      // F1 → Produtos
      if (e.key === "F1") {
        e.preventDefault();
        fetchProducts();
        setIsProductModalOpen(true);
      }

      // F2 → Clientes
      if (e.key === "F2") {
        e.preventDefault();
        fetchClients();
        setIsClientModalOpen(true);
      }

      // F3 → Desconto
      if (e.key === "F3") {
        e.preventDefault();
        setIsDiscountModalOpen(true);
      }

      // ESC → Fecha qualquer modal
      if (e.key === "Escape") {
        if (
          !isClientModalOpen &&
          !isProductModalOpen &&
          !isPaymentModalOpen
        ) {
          navigate("/dashboard");
          return;
        }

        setIsProductModalOpen(false);
        setIsClientModalOpen(false);
        setIsPaymentModalOpen(false);
        
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval)
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-background-dark flex flex-col overflow-hidden animate-in fade-in duration-300">
      {/* POS Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-surface-dark border-b border-border-dark">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded text-background-dark shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined block text-2xl font-black">shopping_cart</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">Liderança <span className="text-primary">Construções</span></h1>
          </div>
          <div className="h-8 w-px bg-border-dark hidden md:block"></div>
          <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">store</span>
              <span>Santa Inês - Loja 01</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-primary">person</span>
              <span>Caixa: #104 (Carlos S.)</span>
            </div> */}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-border-dark">
            <span className="material-symbols-outlined text-primary text-xl">schedule</span>
            <span className="text-lg font-mono font-black text-white">{currentTime}</span>
          </div>
          <button className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-400">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button onClick={() => exit()}className="p-2.5 hover:bg-rose-500/20 rounded-xl transition-colors text-rose-500">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">

        {/* Center item list */}
        <section className="flex-1 flex flex-col bg-background-dark relative">
          <div className="p-5 bg-surface-dark/50 border-b border-border-dark flex gap-4 backdrop-blur-md">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">barcode_scanner</span>
              <input value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchProductByBarcode(searchProduct);
                    setSearchProduct("");
                  }
                  if (e.key === "F1") {
                    e.preventDefault();
                    fetchProducts();
                    setIsProductModalOpen(true);
                  }
                }} className="w-full bg-black/40 border-border-dark rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-primary focus:border-primary transition-all text-xl font-black uppercase tracking-tight" 
                placeholder="código de barras (F1)" type="text"/>
            </div>
            <button onClick= {() => {fetchProducts();
                    setIsProductModalOpen(true);}}className="bg-primary text-background-dark font-black px-8 rounded-2xl flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20">
              <span className="material-symbols-outlined font-black">add</span>
              <span className="uppercase tracking-widest text-sm">ADICIONAR</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20 select-none">
                 <span className="material-symbols-outlined text-[120px]">shopping_cart</span>
                 <p className="text-2xl font-black uppercase tracking-widest mt-4 italic">Carrinho Vazio</p>
              </div>
            ) : (
              <table className="w-full border-separate border-spacing-y-3">
                <thead className="sticky top-0 bg-background-dark z-10">
                  <tr className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] text-left">
                    <th className="px-5 py-3">Item</th>
                    <th className="px-5 py-3">Produto</th>
                    <th className="px-5 py-3 text-center">Qtd</th>
                    <th className="px-5 py-3 text-right">Unitário</th>
                    <th className="px-5 py-3 text-right">Desconto</th>
                    <th className="px-5 py-3 text-right">Total</th>
                    <th className="px-5 py-3 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item.id} className={`transition-all group ${
                        selectedIndex === index
                          ? "bg-primary/20"
                          : "hover:bg-white/5"
                      }`}>
                      <td className={`px-5 py-5 rounded-l-2xl font-mono text-sm ${item.pulse ? 'text-primary font-black' : 'text-slate-600'}`}>{item.id}</td>
                      <td className="px-5 py-5">
                        <div className={`font-black uppercase leading-tight text-base ${item.pulse ? 'text-primary' : 'text-white'}`}>{item.name}</div>
                        <div className={`text-[10px] font-bold uppercase tracking-widest ${item.pulse ? 'text-primary/70' : 'text-slate-600'}`}>{item.sku}</div>
                      </td>
                      <td className="px-5 py-5 text-center">
                        {editingIndex === index ? (
                          <input
                            type="number"
                            autoFocus
                            value={tempQty}
                            onChange={(e) => setTempQty(e.target.value)}
                            onBlur={() => saveQty(index)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveQty(index);
                              if (e.key === "Escape") {
                                setEditingIndex(null);
                                setTempQty("");
                              }
                            }}
                            className="w-20 text-center bg-black/40 border border-primary rounded-lg text-white font-black focus:ring-2 focus:ring-primary outline-none"
                          />
                        ) : (
                          <span
                            onClick={() => {
                              setEditingIndex(index);
                              setTempQty(String(item.qty));
                            }}
                            className="cursor-pointer font-black hover:text-primary transition-colors"
                          >
                            {item.qty}
                          </span>
                        )}
                      </td>
                      <td className={`px-5 py-5 text-right font-mono text-lg ${item.pulse ? 'text-primary/80 font-black' : 'text-slate-400'}`}>R$ {item.unit.toFixed(2)}</td>
                      <td className={`px-5 py-5 text-right font-mono text-lg ${item.pulse ? 'text-primary/80 font-black' : 'text-slate-400'}`}>R$ {getItemDiscountValue(item).toFixed(2)}</td>
                      <td className={`px-5 py-5 text-right font-mono text-xl font-black ${item.pulse ? 'text-primary' : 'text-white'}`}>R$ {(item.qty * (item.unit - getItemDiscountValue(item))).toFixed(2)}</td>
                      <td className="px-5 py-5 rounded-r-2xl text-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="material-symbols-outlined text-slate-700 hover:text-rose-500 transition-colors"
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Shortcut Legend */}
          <div className="p-4 bg-surface-dark border-t border-border-dark grid grid-cols-4 md:grid-cols-8 gap-3">
            {[
              { k: 'F1', l: 'Busca Produtos' },
              { k: 'F2', l: 'busca clientes' },
              { k: 'F3', l: 'Desconto' },
              { k: 'F6', l: 'Vendedor' },
              { k: 'ESC', l: 'Cancelar', c: 'text-primary' },
            ].map((key, i) => (
              <div key={i} className={`flex flex-col items-center ${key.c || 'text-slate-400'}`}>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5">{key.k}</span>
                <span className="text-xs font-bold uppercase tracking-tighter">{key.l}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Summary side panel */}
        <aside className="w-80 md:w-96 bg-surface-dark border-l border-border-dark flex flex-col p-8 shadow-2xl z-20">
          <div className="mb-10">
            <label className="block text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Cliente (CPF/CNPJ)</label>
            <div className="relative group">
              <input
                value={searchClient}
                onChange={(e) => setSearchClient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchClientByDocument(searchClient);
                  }
                  if (e.key === "F2") {
                    e.preventDefault();
                    fetchClients();
                    setIsClientModalOpen(true);
                  }
                }}
                className="w-full bg-black/40 border-border-dark rounded-xl py-4 px-5 text-white text-lg font-bold tracking-widest focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700"
                placeholder="Digite CPF ou CNPJ"
              />
              <button onClick={() => {fetchClients(), setIsClientModalOpen(true)}}  className="absolute right-4 top-1/2 -translate-y-1/2 text-primary p-1 hover:scale-110 transition-transform">
                <span className="material-symbols-outlined font-black">person_search</span>
              </button>
            </div>
            <div className="mt-4 flex items-center gap-3 bg-green-500/5 p-3 rounded-xl border border-green-500/10">
              <div className="size-2.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest"><span className="text-white">{selectedClient ? selectedClient.name : "Nenhum cliente"}</span></span>
            </div>
          </div>

          <div className="flex-1 space-y-7 pt-7 border-t border-border-dark/50">
            <div className="flex justify-between items-center group">
              <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Subtotal</span>
              <span className="text-2xl font-mono font-black text-white">R$ {subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-green-500 group">
              <span className="font-bold uppercase tracking-widest text-xs">Descontos</span>
              <span className="text-2xl font-mono font-black">- R$ {discountTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-auto mb-5 bg-black/50 rounded-[2.5rem] p-5 border-2 border-primary/20 flex flex-col items-end shadow-inner group">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 group-hover:text-primary transition-colors">Total a Pagar</span>
            <div className="text-primary text-5xl font-black font-mono tracking-tighter leading-none">
              <span className="text-3xl align-top mt-4 mr-2">R$</span>{total.toFixed(2).split('.')[0]}<span className="text-3xl">,{total.toFixed(2).split('.')[1]}</span>
            </div>
            <div className="mt-4 text-slate-600 text-xs font-bold italic uppercase tracking-widest">
              {cart.reduce((a, b) => a + b.qty, 0)} itens no carrinho
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => setIsPaymentOpen(true)}
              disabled={cart.length === 0}
              className="bg-primary text-background-dark py-7 rounded-[2rem] font-black text-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 uppercase tracking-tighter disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
            >
              <span className="material-symbols-outlined font-black text-4xl">payments</span>
              FINALIZAR VENDA
            </button>
            <button 
            onClick={() => {{/*finalySave(false, null),*/} setIsPendingModalOpen(true)}}
            className="bg-surface-dark border border-border-dark text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-lg">receipt_long</span>
              CONTA PENDENTE
            </button>
          </div>
        </aside>
      </main>

      {/* Decorative background logo */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.03] pointer-events-none rotate-12">
        <span className="material-symbols-outlined text-[300px]">shopping_cart_checkout</span>
      </div>

      {isProductModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">

          <div className="w-full max-w-5xl bg-gradient-to-br from-surface-dark to-background-dark border border-border-dark rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">

            {/* Fechar */}
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-rose-500 transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-black uppercase tracking-tight italic text-white">
                Lista de <span className="text-primary">Produtos</span>
              </h2>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mt-2">
                Selecione um produto para adicionar ao carrinho
              </p> 
            </div>

            {/* Busca */}
            <div className="mb-6 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por nome ou código..."
                className="w-full bg-black/40 border border-border-dark rounded-2xl py-4 pl-14 pr-6 text-white font-bold tracking-tight focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                onChange={(e) => {
                  const value = e.target.value.toLowerCase();

                  if (!value) {
                    setFilteredProducts(products);
                    return;
                  }

                  const filtered = products.filter((p) =>
                    p.product_name.toLowerCase().includes(value) ||
                    p.barcode.includes(value)
                  );

                  setFilteredProducts(filtered);
                }}
              />
            </div>

            {/* Lista */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 text-slate-600 opacity-40">
                  <span className="material-symbols-outlined text-6xl">
                    inventory_2
                  </span>
                  <p className="mt-4 font-black uppercase tracking-widest">
                    Nenhum produto encontrado
                  </p>
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      addProductToCart(product);
                      setIsProductModalOpen(false);
                    }}
                    className="group p-6 mb-3 rounded-2xl border border-border-dark bg-black/30 hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <p className="font-black text-white text-lg uppercase tracking-tight group-hover:text-primary transition-colors">
                        {product.product_name}
                      </p>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                        Código: {product.barcode}
                      </p>
                    </div>

                    <div className="flex-1 text-center">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                        {product.mark}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-primary font-black text-xl font-mono">
                        R$ {Number(product.sale_price).toFixed(2)}
                      </p>
                      <p className="text-slate-600 text-xs uppercase tracking-widest">
                        Estoque: {product.stock}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border-dark flex justify-between items-center">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                {filteredProducts.length} produtos disponíveis
              </span>

              <button
                onClick={() => setIsProductModalOpen(false)}
                className="bg-rose-500/20 border border-rose-500 text-rose-500 px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}
    {isClientModalOpen && (
      <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">

        <div className="w-full max-w-5xl bg-gradient-to-br from-surface-dark to-background-dark border border-border-dark rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">

          {/* Fechar */}
          <button
            onClick={() => setIsClientModalOpen(false)}
            className="absolute top-6 right-6 text-slate-500 hover:text-rose-500 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase tracking-tight italic text-white">
              Lista de <span className="text-primary">Clientes</span>
            </h2>
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold mt-2">
              Selecione um cliente para vincular à venda
            </p>
          </div>

          {/* Busca */}
          <div className="mb-6 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por nome ou CPF/CNPJ..."
              className="w-full bg-black/40 border border-border-dark rounded-2xl py-4 pl-14 pr-6 text-white font-bold tracking-tight focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
              onChange={(e) => {
                const value = e.target.value.toLowerCase();

                if (!value) {
                  setFilteredClients(clients);
                  return;
                }

                const filtered = clients.filter((c) =>
                  c.name.toLowerCase().includes(value) ||
                  c.cnpj_cpf.includes(value)
                );

                setFilteredClients(filtered);
              }}
            />
          </div>

          {/* Lista */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">

            {filteredClients.length === 0 ? (
              <div className="text-center py-20 text-slate-600 opacity-40">
                <span className="material-symbols-outlined text-6xl">
                  person_off
                </span>
                <p className="mt-4 font-black uppercase tracking-widest">
                  Nenhum cliente encontrado
                </p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => {
                    setSelectedClient(client);
                    setIsClientModalOpen(false);
                  }}
                  className="group p-6 mb-3 rounded-2xl border border-border-dark bg-black/30 hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer flex justify-between items-center"
                >
                  <div>
                    <p className="font-black text-white text-lg uppercase tracking-tight group-hover:text-primary transition-colors">
                      {client.name}
                    </p>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                      Documento: {client.cnpj_cpf}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-primary font-black text-lg">
                      {client.phone || "—"}
                    </p>
                    <p className="text-slate-600 text-xs uppercase tracking-widest">
                      Cliente
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border-dark flex justify-between items-center">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              {filteredClients.length} clientes disponíveis
            </span>

            <button
              onClick={() => setIsClientModalOpen(false)}
              className="bg-rose-500/20 border border-rose-500 text-rose-500 px-6 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
            >
              Cancelar
            </button>
          </div>

        </div>
      </div>
    )}
  
    {isDiscountModalOpen && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-black border border-primary w-[400px] rounded-xl p-6 shadow-lg">

          <h2 className="text-primary text-xl font-mono mb-6">
            Desconto Global (%)
          </h2>

          <input
            type="number"
            autoFocus
            value={discountInput}
            onChange={(e) => setDiscountInput(e.target.value)}
            className="w-full bg-black border border-primary text-primary p-3 rounded-lg text-xl font-mono outline-none"
            placeholder="Digite o percentual"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirmDiscount();
              if (e.key === "Escape") setIsDiscountModalOpen(false);
            }}
          />

          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {setIsDiscountModalOpen(false), clearGlobalDiscount()}}
              className="px-4 py-2 border border-red-500 text-red-500 rounded-lg"
            >
              Cancelar Desconto
            </button>

            <button
              onClick={handleConfirmDiscount}
              className="px-4 py-2 bg-primary text-black rounded-lg font-bold"
            >
              Aplicar
            </button>
          </div>
        </div>
      </div>
    )}
    {isPaymentOpen && (
      <PaymentModal
        isOpen={isPaymentOpen}
        total={total}
        itemsCount={cart.reduce((a, b) => a + b.qty, 0)}
        onClose={() => {setIsPaymentOpen(false)}}
        onCancel={() => {}}
        onDestroy={() => pdf()}
        isSaving={isSaving}
        saleCompleted={saleCompleted}
        onConfirmPayment={handlePaymentConfirm}
        onSendEmail={sendEmail}
        onSendWhats={sendWhatsApp}
        onResetSale={() => {
          setSaleCompleted(false);
          setIsPaymentOpen(false);
        }}
      />
    )}
    {isPendingModalOpen && (
      <PendingAccountModal
        isOpen={isPendingModalOpen}
        onClose={() => setIsPendingModalOpen(false)}
        totalAmount={total}
        onDestroy= {() => pdf()}
        onConfirm={(data) => {
          console.log("Dados recebidos:", data);
            finalySave(false, null, { advanceAmount: data.advanceAmount, dueDate: data.paymentDate} 
            )

        }}
        />
      )}
    </div>
  );
};

export default POSTerminal;
