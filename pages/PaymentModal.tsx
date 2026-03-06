import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Banknote,
  CreditCard,
  QrCode,
  X,
  CheckCircle2,
  Printer,
  Mail,
  Share2,
  ShoppingCart,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  total: number;
  itemsCount: number;
  onClose: () => void;
  onCancel: () => void;
  onDestroy: () => void;
  onConfirmPayment: (paymentData: any) => void;
  onSendWhats: () => void;
  onSendEmail: () => void;
}

const paymentMethods = [
  { name: "Dinheiro", icon: <Banknote size={26} /> },
  { name: "Cartão Crédito", icon: <CreditCard size={26} /> },
  { name: "Cartão Débito", icon: <CreditCard size={26} /> },
  { name: "PIX", icon: <QrCode size={26} /> },
];

export function PaymentModal({
  isOpen,
  total,
  itemsCount,
  onClose,
  onCancel,
  onDestroy,
  onConfirmPayment,
  onSendWhats, 
  onSendEmail
}: PaymentModalProps) {
  const [isSplit, setIsSplit] = useState(false);
  const [methodSingle, setMethodSingle] = useState("Dinheiro");
  const [cashReceived, setCashReceived] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [splitPayments, setSplitPayments] = useState([
    { method: "Dinheiro", value: "" },
    { method: "Cartão Crédito", value: "" },
  ]);
  
  if (!isOpen) return null;

  // ==============================
  // 🔹 PAGAMENTO DIVIDIDO INTELIGENTE
  // ==============================

  let paymentData

  if(isSplit){
    paymentData = splitPayments.map(p => ({
      method: p.method,
      value: parseFloat(p.value.replace(",", "."))
    }));
  }else{
    paymentData = methodSingle
  }
  

  const paymentData1 = {
    method: methodSingle,
    value: total
  };
  const handleSplitChange = (index: number, rawValue: string) => {
    const value = parseFloat(rawValue.replace(",", ".")) || 0;

    setSplitPayments((prev) => {
      const updated = [...prev];

      updated[index].value = rawValue;

      const otherIndex = index === 0 ? 1 : 0;
      const remaining = Math.max(0, total - value);

      updated[otherIndex].value = remaining
        .toFixed(2)
        .replace(".", ",");

      return updated;
    });
  };

  const finish = () => {
    let paymentData;

    if (isSplit) {
      paymentData = splitPayments.map(p => ({
        method: p.method,
        value: parseFloat(p.value.replace(",", "."))
      }));
    } else {
      paymentData = {
        method: methodSingle,
        value: methodSingle === "Dinheiro"
          ? parseFloat(cashReceived.replace(",", "."))
          : total
      };
    }

    onConfirmPayment(paymentData);
    setPaymentCompleted(true);
  }

  // ==============================
  // 🔹 CÁLCULOS
  // ==============================

  const parsedReceived =
    parseFloat(cashReceived.replace(",", ".")) || 0;

  const parsedSplitValues = splitPayments.map((p) =>
    parseFloat(p.value.replace(",", ".")) || 0
  );

  const totalSplit = parsedSplitValues.reduce(
    (acc, val) => acc + val,
    0
  );

  const cashPaymentIndex = splitPayments.findIndex(
    (p) => p.method === "Dinheiro"
  );

  const cashValue =
    cashPaymentIndex !== -1
      ? parsedSplitValues[cashPaymentIndex]
      : 0;

  const hasCash =
    (!isSplit && methodSingle === "Dinheiro") ||
    (isSplit && cashPaymentIndex !== -1);

  const change = hasCash
    ? Math.max(
        0,
        parsedReceived - (isSplit ? cashValue : total)
      )
    : 0;

  const isPaid = isSplit
    ? totalSplit >= total
    : methodSingle !== "Dinheiro" || parsedReceived >= total;

  // ==============================
  // 🔹 RENDER
  // ==============================

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        
          {paymentCompleted && 
            (<motion.div 
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md space-y-10 bg-[#111] p-8 rounded-2xl"
            >
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#4ade80]">
                <CheckCircle2 className="w-10 h-10" />
                <h2 className="text-4xl font-black tracking-tight">Venda Finalizada!</h2>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
                O cupom fiscal foi emitido com sucesso e a transação foi aprovada.
                </p>
            </div>

            <div className="space-y-4">
                <button onClick={() => onDestroy()} className="w-full h-14 bg-[#fcc000] text-[#222115] font-bold text-lg rounded-xl flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-lg shadow-[#fcc000]/10">
                <Printer className="w-6 h-6" />
                Imprimir Cupom
                </button>
                
                <button onClick={() => onSendEmail()} className="w-full h-14 bg-[#33322a] text-white font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-[#3d3c33] transition-all">
                <Mail className="w-6 h-6" />
                Enviar por E-mail
                </button>
                
                <button onClick={() => onSendWhats()} className="w-full h-14 bg-[#33322a] text-white font-semibold rounded-xl flex items-center justify-center gap-3 hover:bg-[#3d3c33] transition-all">
                <Share2 className="w-6 h-6" />
                Enviar via WhatsApp
                </button>
            </div>

            <div className="pt-3 border-t border-white/5">
                <button onClick= {() => onClose()}className="w-full h-14 border-2 border-[#fcc000] text-[#fcc000] font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-[#fcc000] hover:text-[#222115] transition-all">
                <ShoppingCart className="w-6 h-6" />
                Nova Venda
                </button>
            </div>
            </motion.div>)}  
          
          {/* HEADER */}
          {!paymentCompleted && (
            <motion.div className="bg-[#0f0f0f] w-full max-w-3xl rounded-2xl border border-yellow-500/20 shadow-2xl">
            <div className="flex justify-between items-center px-8 py-6 border-b border-yellow-500/10">
            <h2 className="text-2xl font-black italic uppercase">
              Finalizar <span className="text-yellow-400">Pagamento</span>
            </h2>
            <button onClick={onClose}>
              <X size={26} className="text-slate-400 hover:text-white" />
            </button>
          </div>

          <div className="p-8 space-y-8">

            {/* TOTAL */}
            <div className="flex justify-between items-end bg-black/60 p-6 rounded-xl border border-yellow-400/20">
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold">
                  Valor Total da Venda
                </p>
                <p className="text-slate-400 text-sm">
                  {itemsCount} itens no carrinho
                </p>
              </div>

              <div className="text-yellow-400 text-5xl font-black font-mono">
                R$ {total.toFixed(2).replace(".", ",")}
              </div>
            </div>

            {/* TOGGLE */}
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold uppercase text-sm">
                Pagamento dividido
              </span>

              <button
                onClick={() => setIsSplit(!isSplit)}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition ${
                  isSplit ? "bg-yellow-400" : "bg-slate-700"
                }`}
              >
                <div
                  className={`bg-black w-6 h-6 rounded-full transition ${
                    isSplit ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            {/* NÃO DIVIDIDO */}
            {!isSplit && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  {paymentMethods.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setMethodSingle(m.name)}
                      className={`flex flex-col items-center gap-2 py-6 rounded-xl border ${
                        methodSingle === m.name
                          ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                          : "border-slate-700 text-slate-400"
                      }`}
                    >
                      {m.icon}
                      <span className="text-xs font-bold uppercase">
                        {m.name}
                      </span>
                    </button>
                  ))}
                </div>

                {methodSingle === "Dinheiro" && (
                  <input
                    value={cashReceived}
                    onChange={(e) =>
                      setCashReceived(e.target.value)
                    }
                    placeholder="Valor recebido"
                    className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white font-mono"
                  />
                )}
              </>
            )}

            {/* DIVIDIDO */}
            {isSplit && (
              <div className="grid grid-cols-2 gap-6">
                {splitPayments.map((payment, index) => (
                  <div key={index} className="space-y-3">

                    <select
                      value={payment.method}
                      onChange={(e) => {
                        const updated = [...splitPayments];
                        updated[index].method = e.target.value;
                        setSplitPayments(updated);
                      }}
                      className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white"
                    >
                      {paymentMethods.map((m) => (
                        <option key={m.name}>{m.name}</option>
                      ))}
                    </select>

                    <input
                      value={payment.value}
                      onChange={(e) =>
                        handleSplitChange(index, e.target.value)
                      }
                      placeholder="Valor"
                      className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white font-mono"
                    />
                  </div>
                ))}

                {/* Campo recebido se tiver dinheiro */}
                {hasCash && !isSplit && (
                  <div className="col-span-2">
                    <input
                      value={cashReceived}
                      onChange={(e) =>
                        setCashReceived(e.target.value)
                      }
                      placeholder="Valor recebido em dinheiro"
                      className="w-full bg-black border border-slate-700 rounded-lg px-4 py-3 text-white font-mono"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TROCO */}
            { !isSplit &&
                (<div className="flex justify-between border-t border-slate-700 pt-6">
                    <span className="text-slate-400">
                        Troco:
                    </span>
                    <span className="text-green-400 font-bold text-2xl font-mono">
                        R$ {change.toFixed(2).replace(".", ",")}
                    </span>
                    </div>
                )}
            {/* FINALIZAR */}
            <button
              disabled={!isPaid}
              onClick = {() => {finish(), onCancel()}}
              className={`w-full py-6 rounded-2xl font-black text-2xl uppercase italic transition ${
                isPaid
                  ? "bg-yellow-400 text-black"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
            >
              <CheckCircle2 size={26} className="inline mr-2" />
              Finalizar Venda
            </button>

          </div>
          </motion.div>
        )}
        
      </motion.div>

    </AnimatePresence>
  );
}