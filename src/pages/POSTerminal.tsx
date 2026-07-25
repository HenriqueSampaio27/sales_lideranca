import React from "react";
import { usePOSTerminal } from "../hooks/usePOSTerminal";
import {
  POSHeader,
  POSBarcodeBar,
  POSCartTable,
  POSShortcutFooter,
  POSSummaryPanel,
  ProductSearchModal,
  ClientSearchModal,
  DiscountModal,
  PaymentModal,
  PendentModal,
} from "../components/pos";
import { posColors } from "../theme";
import { useNavigate } from "react-router-dom";

export const POSTerminal: React.FC = () => {
  const {
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
  } = usePOSTerminal();


  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: posColors.bg,
        color: posColors.textPrimary,
      }}
      className="h-screen w-screen flex flex-col font-sans overflow-hidden select-none"
    >
      {/* HEADER */}
      <POSHeader
        isQuoteMode={isQuoteMode}
        currentTime={currentTime}
        onToggleQuoteMode={() => setIsQuoteMode((prev) => !prev)}
        onExit={() => {
          const confirmExit = window.confirm("Deseja realmente sair do PDV?");
          if (confirmExit) {
            navigate("/dashboard"); // ou outra rota
          }
        }}
      />

      {/* BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* LADO ESQUERDO: BARRA DE BARRAS, TABELA E ATALHOS */}
        <div
          style={{ borderColor: posColors.headerBorder }}
          className="flex-1 flex flex-col border-r overflow-hidden"
        >
          {/* BARRAS DE BUSCA / CÓDIGO */}
          <POSBarcodeBar
            searchProduct={productsState.searchProduct}
            inputRef={barcodeInputRef}
            onSearchChange={productsState.setSearchProduct}
            onSearchSubmit={(barcode) =>
              productsState.searchProductByBarcode(
                barcode,
                cartState.addProductToCart
              )
            }
            onOpenProductModal={() => productsState.setIsProductModalOpen(true)}
          />

          {/* TABELA DE ITENS DO CARRINHO */}
          <div className="flex-1 p-6 overflow-y-auto">
            <POSCartTable
              cart={cartState.cart}
              selectedIndex={null}
              getItemDiscountValue={cartState.getItemDiscountValue}
              onUpdateQty={cartState.updateItemQty}
              onRemoveItem={cartState.removeItem}
            />
          </div>

          {/* RODAPÉ DE ATALHOS */}
          <POSShortcutFooter />
        </div>

        {/* LADO DIREITO: RESUMO E AÇÕES */}
        <POSSummaryPanel
          searchClient={clientsState.searchClient}
          selectedClient={clientsState.selectedClient}
          subTotal={cartState.subTotal}
          discountTotal={cartState.discountTotal}
          total={cartState.total}
          itemsCount={cartState.totalItemsCount}
          isCartEmpty={cartState.cart.length === 0}
          onSearchClientChange={clientsState.setSearchClient}
          onSearchClientSubmit={(doc) =>
            clientsState.searchClientByDocument(doc)
          }
          onOpenClientModal={() => clientsState.setIsClientModalOpen(true)}
          onOpenPaymentModal={() => setIsPaymentOpen(true)}
          onOpenPendingModal={() => setIsPendingModalOpen(true)}
        />
      </div>

      {/* MODAL DE PRODUTOS */}
      <ProductSearchModal
        isOpen={productsState.isProductModalOpen}
        products={productsState.products}
        filteredProducts={productsState.filteredProducts}
        onClose={() => productsState.setIsProductModalOpen(false)}
        onFilterChange={productsState.filterProducts}
        onSelectProduct={cartState.addProductToCart}
      />

      {/* MODAL DE CLIENTES */}
      <ClientSearchModal
        isOpen={clientsState.isClientModalOpen}
        filteredClients={clientsState.filteredClients}
        onClose={() => clientsState.setIsClientModalOpen(false)}
        onFilterChange={clientsState.filterClients}
        onSelectClient={clientsState.setSelectedClient}
      />

      {/* MODAL DE DESCONTO */}
      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        onApplyPercent={cartState.applyGlobalDiscount}
        onApplyValue={cartState.applyGlobalDiscountValue}
        onClearDiscount={cartState.clearGlobalDiscount}
      />

      {/* MODAL DE PAGAMENTO */}
      {isPaymentOpen && (
        <PaymentModal
          isOpen={isPaymentOpen}
          total={cartState.total}
          itemsCount={cartState.totalItemsCount}
          onClose={() => setIsPaymentOpen(false)}
          onDestroy={() => print.pdf()}
          onPrint={() => print.handlePrint()}
          isSaving={sale.isSaving}
          saleCompleted={sale.saleCompleted}
          onConfirmPayment={async (paymentData) => {
            await sale.finalySave(true, paymentData);
          }}
          onSendEmail={share.sendEmail}
          onSendWhats={share.sendWhatsApp}
          onResetSale={sale.resetPOSState}
        />
      )}

      {/* MODAL DE CONTA PENDENTE */}
      {isPendingModalOpen && (
        <PendentModal
          isOpen={isPendingModalOpen}
          onClose={() => setIsPendingModalOpen(false)}
          totalAmount={cartState.total}
          onDestroy={() => {}}
          onConfirm={async (data) => {
            await sale.finalySave(false, null, {
              advanceAmount: data.advanceAmount,
              dueDate: data.paymentDate,
            });
            setIsPendingModalOpen(false);

            const confirmPrint = window.confirm("Deseja imprimir o cupom?");
            if (confirmPrint) {
              print.handlePrint();
            }

            sale.resetPOSState();
          }}
        />
      )}
    </div>
  );
};

export default POSTerminal;
