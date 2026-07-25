import { useCallback } from "react";
import { InvoiceService } from "../services/InvoiceService";
import { gerarCupomTermicoHTML } from "../utils/receipt";
import { COMPANY_INFO } from "../constants/company";
import { CouponData, ItemsCoupon, Client } from "../types";
import { useCart } from "./useCart";

export interface UsePOSPrintParams {
  lastInvoiceId: string | null;
  cartState: ReturnType<typeof useCart>;
  selectedClient: Client | null;
}

export function usePOSPrint({
  lastInvoiceId,
  cartState,
  selectedClient,
}: UsePOSPrintParams) {
  const getCouponData = useCallback((): {
    data: CouponData;
    items: ItemsCoupon;
  } => {
    const couponData: CouponData = {
      id: lastInvoiceId || "000000",
      issue_date: new Date(),
      companyName: COMPANY_INFO.subtitle,
      address: COMPANY_INFO.address,
      cityStateZip: COMPANY_INFO.cityStateZip,
      cnpj: COMPANY_INFO.cnpj,
    };

    const itemsCoupon: ItemsCoupon = {
      rows: cartState.cart.map((item) => {
        const discVal = cartState.getItemDiscountValue(item);
        return {
          product_name: item.name,
          quantity: item.qty,
          unit_price: item.unit,
          discount_value: discVal,
        };
      }),
    };

    return { data: couponData, items: itemsCoupon };
  }, [lastInvoiceId, cartState]);

  const handlePrint = useCallback(() => {
    const { data, items } = getCouponData();
    const html = gerarCupomTermicoHTML(
      data,
      selectedClient,
      items
    );

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
        win.close();
      }, 500);
    }
  }, [getCouponData, selectedClient]);

  const pdf = useCallback(() => {
    if (lastInvoiceId) {
      window.open(InvoiceService.getDanfeUrl(lastInvoiceId), "_blank");
    }
  }, [lastInvoiceId]);

  return {
    getCouponData,
    handlePrint,
    pdf,
  };
}
