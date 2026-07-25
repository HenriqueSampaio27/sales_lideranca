import { Client, CouponData, ItemsCoupon } from "../types";

/**
 * Gera o documento HTML do cupom térmico não fiscal.
 */
export function gerarCupomTermicoHTML(
  data: CouponData,
  client: Client | null,
  items: ItemsCoupon
): string {
  const totalItems = items.rows.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  );

  const total = items.rows.reduce((acc, item) => {
    return acc + Number(item.unit_price) * Number(item.quantity);
  }, 0);

  const discount = items.rows.reduce((acc, item) => {
    return acc + Number(item.discount_value) * Number(item.quantity);
  }, 0);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Cupom ${data.id}</title>

<style>
  body {
    font-family: monospace;
    width: 58mm;
    margin: 0;
    padding: 5px;
  }

  .center { text-align: center; }
  .bold { font-weight: bold; }
  .small { font-size: 10px; }
  .left { text-align: left; }

  .line {
    border-top: 1px dashed #000;
    margin: 5px 0;
  }

  .row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }

  .item {
    margin-bottom: 4px;
  }

  @media print {
    body {
      width: 58mm;
    }

    @page {
      margin: 0;
    }
  }
</style>
</head>

<body>

<div class="center bold">
  LIDERANÇA CONSTRUÇÕES
</div>

<div class="center small">
  ${data.companyName || ""}
</div>

<div class="center small">
  CNPJ: ${data.cnpj || "---"}
</div>

<div class="center small">
  ${data.address || ""}
</div>

<div class="center small">
  ${data.cityStateZip || ""}
</div>

<div class="line"></div>

${
  client !== null
    ? `<div class="left small">
  Nome: ${client?.name || ""}
</div>

<div class="left small">
  CNPJ: ${client?.cnpj_cpf || "---"}
</div>

<div class="left small">
  Celular: ${client?.phone || ""}
</div>

<div class="left small">
  ${client?.logradouro ? client.logradouro + ", nº " + client.number + ", \n" + client.district : ""}
</div>

<div class="line"></div>`
    : ""
}

<div class="center bold small">
  CUPOM NÃO FISCAL
</div>

<div class="line"></div>

${items.rows
  .map(
    (item) => `
  <div class="item">
    <div class="bold small">${item.product_name}</div>
    <div class="row small">
      <span>${item.quantity}UN x ${Number(item.unit_price).toFixed(2)}</span>
      <span>${(item.quantity * item.unit_price).toFixed(2)}</span>
    </div>
    ${
      discount !== 0
        ? `<div class="row small">
        <span>Desconto</span>
        <span>${Number(item.discount_value).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}</span>
        </div>`
        : ""
    }
  </div>
`
  )
  .join("")}

<div class="line"></div>

<div class="row small">
  <span>Itens:</span>
  <span>${totalItems}</span>
</div>

<div class="row small">
  <span>Subtotal:</span>
  <span>${total.toFixed(2)}</span>
</div>

${
  discount !== 0
    ? `<div class="row small">
  <span>Desconto:</span>
  <span>${discount.toFixed(2)}</span>
</div>`
    : ""
}

<div class="row bold">
  <span>TOTAL:</span>
  <span>${(total - discount).toFixed(2)}</span>
</div>

<div class="line"></div>

<div class="center small">
  ${new Date(data.issue_date).toLocaleString()}
</div>

<div class="center small">
  Obrigado pela preferência!
</div>

<br><br>

</body>
</html>
`;
}
