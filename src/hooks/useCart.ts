import { useState, useCallback, useMemo } from "react";
import { CartItem, Product } from "../types";

export function getItemDiscountValue(item: CartItem): number {
  if (!item.appliedDiscountPercent) return 0;
  return (item.appliedDiscountPercent / 100) * item.unit;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCupom, setCartCupom] = useState<CartItem[]>([]);

  const addProductToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);

      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
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
          maxDiscountPercent: Number(product.discount || 0),
          appliedDiscountPercent: 0,
        },
      ];
    });
  }, []);

  const applyGlobalDiscount = useCallback((operatorPercent: number) => {
    if (operatorPercent < 0) return;

    setCart((prev) =>
      prev.map((item) => {
        const finalPercent = Math.min(
          operatorPercent,
          item.maxDiscountPercent ?? 0
        );

        return {
          ...item,
          appliedDiscountPercent: finalPercent,
        };
      })
    );
  }, []);

  const applyGlobalDiscountValue = useCallback((discountValue: number) => {
    if (discountValue <= 0) return;

    setCart((prev) => {
      const totalSum = prev.reduce((acc, item) => acc + item.unit * item.qty, 0);
      if (totalSum <= 0) return prev;

      return prev.map((item) => {
        const subtotal = item.unit * item.qty;
        const proportion = subtotal / totalSum;
        const itemDiscount = discountValue * proportion;
        const percent = (itemDiscount / subtotal) * 100;

        return {
          ...item,
          appliedDiscountPercent: Math.min(
            percent,
            item.maxDiscountPercent ?? 0
          ),
        };
      });
    });
  }, []);

  const clearGlobalDiscount = useCallback(() => {
    setCart((prev) =>
      prev.map((item) => ({
        ...item,
        appliedDiscountPercent: 0,
      }))
    );
  }, []);

  const updateItemQty = useCallback((index: number, newQty: number) => {
    if (!newQty || newQty <= 0) return;

    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, qty: newQty } : item))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar?")) return;
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const subTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty * item.unit, 0),
    [cart]
  );

  const discountTotal = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const discountValue = getItemDiscountValue(item);
        return acc + discountValue * item.qty;
      }, 0),
    [cart]
  );

  const total = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const discountValue = getItemDiscountValue(item);
        return acc + (item.unit - discountValue) * item.qty;
      }, 0),
    [cart]
  );

  const totalItemsCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.qty, 0),
    [cart]
  );

  return {
    cart,
    setCart,
    cartCupom,
    setCartCupom,
    addProductToCart,
    applyGlobalDiscount,
    applyGlobalDiscountValue,
    clearGlobalDiscount,
    updateItemQty,
    removeItem,
    clearCart,
    subTotal,
    discountTotal,
    total,
    totalItemsCount,
    getItemDiscountValue,
  };
}
