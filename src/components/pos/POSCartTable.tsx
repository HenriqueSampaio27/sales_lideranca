import React, { useState } from "react";
import { CartItem } from "../../types";
import { posColors, borderRadius } from "../../theme";

interface POSCartTableProps {
  cart: CartItem[];
  selectedIndex: number | null;
  getItemDiscountValue: (item: CartItem) => number;
  onUpdateQty: (index: number, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

export const POSCartTable: React.FC<POSCartTableProps> = ({
  cart,
  selectedIndex,
  getItemDiscountValue,
  onUpdateQty,
  onRemoveItem,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempQty, setTempQty] = useState<string>("");

  const handleSaveQty = (index: number) => {
    const qty = Number(tempQty);
    if (qty && qty > 0) {
      onUpdateQty(index, qty);
    }
    setEditingIndex(null);
    setTempQty("");
  };

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center opacity-30 select-none py-20">
        <span
          style={{ color: posColors.textSecondary }}
          className="material-symbols-outlined text-[120px]"
        >
          shopping_cart
        </span>
        <p
          style={{ color: posColors.textSecondary }}
          className="text-2xl font-black uppercase tracking-widest mt-4 italic"
        >
          Carrinho Vazio
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <table className="w-full border-separate border-spacing-y-2">
        <thead className="sticky top-0 z-10">
          <tr
            style={{ color: posColors.textSecondary }}
            className="text-[11px] font-black uppercase tracking-[0.15em] text-left"
          >
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
          {cart.map((item, index) => {
            const discountVal = getItemDiscountValue(item);
            const itemTotal = (item.unit - discountVal) * item.qty;
            const isSelected = selectedIndex === index;

            return (
              <tr
                key={item.id}
                style={{
                  backgroundColor: isSelected
                    ? posColors.tableRowSelectedBg
                    : posColors.tableRowBg,
                  borderColor: isSelected
                    ? posColors.tableRowSelectedBorder
                    : posColors.cardBorder,
                }}
                className={`transition-all group border shadow-sm ${
                  isSelected ? "font-bold" : "hover:bg-slate-50"
                }`}
              >
                <td
                  style={{
                    borderTopLeftRadius: borderRadius.xl,
                    borderBottomLeftRadius: borderRadius.xl,
                    color: item.pulse
                      ? posColors.primary
                      : posColors.textSecondary,
                  }}
                  className="px-5 py-4 font-mono text-sm font-bold"
                >
                  {item.id}
                </td>
                <td className="px-5 py-4">
                  <div
                    style={{
                      color: item.pulse
                        ? posColors.primaryHover
                        : posColors.textPrimary,
                    }}
                    className="font-black uppercase leading-tight text-base"
                  >
                    {item.name}
                  </div>
                  <div
                    style={{ color: posColors.textSecondary }}
                    className="text-[10px] font-bold uppercase tracking-widest mt-0.5"
                  >
                    {item.sku}
                  </div>
                </td>
                <td className="px-5 py-4 text-center">
                  {editingIndex === index ? (
                    <input
                      type="number"
                      autoFocus
                      value={tempQty}
                      onChange={(e) => setTempQty(e.target.value)}
                      onBlur={() => handleSaveQty(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveQty(index);
                        if (e.key === "Escape") {
                          setEditingIndex(null);
                          setTempQty("");
                        }
                      }}
                      style={{
                        backgroundColor: posColors.cardBg,
                        borderColor: posColors.primary,
                        color: posColors.textPrimary,
                        borderRadius: borderRadius.md,
                      }}
                      className="w-20 text-center border p-1 text-base font-black focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditingIndex(index);
                        setTempQty(String(item.qty));
                      }}
                      style={{ color: posColors.textPrimary }}
                      className="cursor-pointer font-black hover:text-amber-600 transition-colors bg-slate-100 px-3 py-1 rounded-md text-sm inline-block"
                    >
                      {item.qty}
                    </span>
                  )}
                </td>
                <td
                  style={{ color: posColors.textSecondary }}
                  className="px-5 py-4 text-right font-mono text-base font-semibold"
                >
                  R$ {item.unit.toFixed(2)}
                </td>
                <td
                  style={{
                    color:
                      discountVal > 0
                        ? posColors.success
                        : posColors.textSecondary,
                  }}
                  className="px-5 py-4 text-right font-mono text-base font-semibold"
                >
                  R$ {discountVal.toFixed(2)}
                </td>
                <td
                  style={{ color: posColors.textPrimary }}
                  className="px-5 py-4 text-right font-mono text-lg font-black"
                >
                  R$ {itemTotal.toFixed(2)}
                </td>
                <td
                  style={{
                    borderTopRightRadius: borderRadius.xl,
                    borderBottomRightRadius: borderRadius.xl,
                  }}
                  className="px-5 py-4 text-center"
                >
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    aria-label={`Remover item ${item.name}`}
                    style={{ color: posColors.textSecondary }}
                    className="material-symbols-outlined hover:text-red-600 transition-colors p-1 cursor-pointer"
                  >
                    delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};


