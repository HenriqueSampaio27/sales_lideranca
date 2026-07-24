import { Invoice, InvoiceItem } from "../types/finance";

export const handlePrintCupom = (invoice: Invoice): void => {
  try {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let value_sub = 0;
    let value_disc = 0;

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

          ${(invoice.items || [])
            .map((item: InvoiceItem) => {
              value_disc += Number(item.discount_value || 0);
              value_sub += Number(item.unit_price_original) * item.quantity;
              return `
                <div>
                  <div class="item">
                    <span>${item.product_name}</span>
                    <span>${(
                      Number(item.unit_price_original) * Number(item.quantity)
                    ).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}</span>
                  </div>
                  <div class="item">
                    <span>${item.quantity}UN x ${Number(
                item.unit_price_original
              ).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}</span>
                  </div>
                  ${
                    Number(item.discount_value) !== 0
                      ? `<div class="item">
                        <span>Desconto</span>
                        <span>${Number(item.discount_value).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}</span>
                        </div>`
                      : ""
                  }
                </div>
              `;
            })
            .join("")}

          <div class="line"></div>

          <div class="total">
            <span>SUBTOTAL</span>
            <span>${Number(value_sub).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</span>
          </div>
          ${
            value_disc !== 0
              ? `<div class="total">
              <span>DESCONTO</span>
              <span>${Number(value_disc).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}</span>
            </div>`
              : ""
          }
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

export const handlePrintCupomConsolidado = (filteredNotes: Invoice[]): void => {
  const notesToPrint = filteredNotes.filter((note) => note.status !== "PAGO");

  if (notesToPrint.length === 0) {
    alert("Nenhuma nota pendente");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  let value_sub = 0;
  let value_disc = 0;

  // 🔥 junta TODOS os itens de todas as notas
  const allItems = notesToPrint.flatMap((note) => note.items || []);

  const itemsHTML = allItems
    .map((item: InvoiceItem) => {
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
            <span>${item.quantity}UN x ${Number(
        item.unit_price_original
      ).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}</span>
          </div>

          ${
            Number(item.discount_value) !== 0
              ? `
            <div class="item">
              <span>Desconto</span>
              <span>${Number(item.discount_value).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}</span>
            </div>
          `
              : ""
          }
        </div>
      `;
    })
    .join("");

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

        ${
          value_disc !== 0
            ? `
          <div class="total">
            <span>DESCONTO</span>
            <span>${value_disc.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</span>
          </div>
        `
            : ""
        }

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
