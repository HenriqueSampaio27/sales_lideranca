import { useState, useEffect, useRef } from "react";
import {
  useClock,
  useCart,
  useProducts,
  useClients,
  useSale,
  usePOSPrint,
  usePOSShare,
} from "../hooks";
import { useNavigate } from "react-router-dom";

export function usePOSTerminal() {
  const currentTime = useClock();
  const cartState = useCart();
  const productsState = useProducts();
  const clientsState = useClients();

  const [isQuoteMode, setIsQuoteMode] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  const navigate = useNavigate();

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  const sale = useSale({
    cartState,
    clientsState,
    setIsPaymentOpen,
    setIsPendingModalOpen,
    barcodeInputRef,
  });

  const print = usePOSPrint({
    lastInvoiceId: sale.lastInvoiceId,
    cartState,
    selectedClient: clientsState.selectedClient,
  });

  const share = usePOSShare({
    lastInvoiceId: sale.lastInvoiceId,
    selectedClient: clientsState.selectedClient,
  });

  // Carregar produtos e clientes no carregamento inicial
  useEffect(() => {
    productsState.fetchProducts();
    clientsState.fetchClients();
  }, []);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F1") {
        e.preventDefault();
        productsState.setIsProductModalOpen(true);
      } else if (e.key === "F2") {
        e.preventDefault();
        clientsState.setIsClientModalOpen(true);
      } else if (e.key === "F3") {
        e.preventDefault();
        setIsDiscountModalOpen(true);
      } else if (e.key === "Escape") {
        productsState.setIsProductModalOpen(false);
        clientsState.setIsClientModalOpen(false);
        setIsDiscountModalOpen(false);
        setIsPaymentOpen(false);
        setIsPendingModalOpen(false);

        if (
          !productsState.isProductModalOpen &&
          !clientsState.isClientModalOpen &&
          !isDiscountModalOpen &&
          !isPaymentOpen &&
          !isPendingModalOpen
        ) {
          navigate("/dashboard");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productsState, clientsState]);

  return {
    currentTime,

    cartState,
    productsState,
    clientsState,

    sale,
    print,
    share,

    isQuoteMode,
    setIsQuoteMode,

    isPaymentOpen,
    setIsPaymentOpen,

    isPendingModalOpen,
    setIsPendingModalOpen,

    isDiscountModalOpen,
    setIsDiscountModalOpen,

    barcodeInputRef,
  };
}
