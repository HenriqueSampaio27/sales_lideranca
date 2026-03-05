function gerarDanfeHTML(data, items) {
  
  let address

  if(data.customer_logradouro != null){
    address = true
  }else{
    address = false
  }

  const totalQuantity = items.rows.reduce((acc, item) => {
  return acc + Number(item.quantity);
}, 0);

const totalProduct = items.rows.reduce((acc, item) => {
  return acc + Number(item.unit_price_original);
}, 0);

const totalDiscount = items.rows.reduce((acc, item) => {
  return acc + Number(item.discount_value);
}, 0);

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>NOTA - Pedido ${data.id}</title>
  <style>
    /* Reset e Base */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background-color: #fff; color: #000; }

    /* Container Principal */
    .danfe-container {
      width: 210mm;
      margin: 0 auto;
      padding: 10mm;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    /* Utilitários de Grid */
    .grid { display: grid; }
    .grid-12 { grid-template-columns: repeat(12, 1fr); }
    .grid-5 { grid-template-columns: repeat(5, 1fr); }
    .grid-4 { grid-template-columns: repeat(4, 1fr); }
    
    .col-8 { grid-column: span 8; }
    .col-6 { grid-column: span 6; }
    .col-5 { grid-column: span 5; }
    .col-4 { grid-column: span 4; }
    .col-3 { grid-column: span 3; }

    /* Bordas e Espaçamento */
    .border { border: 1px solid #000; }
    .border-t-0 { border-top: 0; }
    .border-r { border-right: 1px solid #000; }
    .border-b { border-bottom: 1px solid #000; }
    .border-x { border-left: 1px solid #000; border-right: 1px solid #000; }
    
    .p-1 { padding: 4px; }
    .p-2 { padding: 8px; }
    .p-3 { padding: 12px; }
    .mt-2 { margin-top: 8px; }
    .bg-gray { background-color: #f3f4f6; }

    /* Flexbox */
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .text-center { text-align: center; }
    .gap-3 { gap: 12px; }

    /* Tipografia DANFE */
    .danfe-label { display: block; font-size: 8px; font-weight: bold; text-transform: uppercase; margin-bottom: 1px; }
    .danfe-value { display: block; font-size: 10px; min-height: 12px; }
    .font-bold { font-weight: bold; }
    .text-xs { font-size: 8px; }
    .text-sm { font-size: 10px; }
    .text-lg { font-size: 14px; }

    /* Tabela de Produtos */
    .danfe-table { width: 100%; border-collapse: collapse; }
    .danfe-table th, .danfe-table td {
      border: 1px solid #000;
      font-size: 9px;
      padding: 3px;
      text-align: left;
    }
    .danfe-table th { background-color: #f9fafb; font-weight: bold; text-transform: uppercase; }
    .text-right { text-align: right; }

    /* Configurações de Impressão */
    @media print {
      body { background: none; }
      .danfe-container { width: 100%; padding: 0; margin: 0; border: none; }
      @page { size: A4; margin: 10mm; }
    }
  </style>
</head>

<body>
  <div class="danfe-container">
    
    <!-- HEADER -->
    <div class="grid grid-12 border">
      <!-- EMPRESA -->
      <div class="col-8 p-3 border-r flex items-center gap-3">
        <div style="width: 80px; height: 60px; display: flex; align-items: center; justify-content: center;">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPwEqWh2fReRDwRGF-302C7B_LikBxoKnTZ6NnqPt02gB1Mq4vsur7AHGeZL3bhxTGX1EeG3oJMQXCNrKCMMANTHwR9PN13nhhoCZwIG8LoFQ81Wq96Tkr0EMvgzrgcpelmYjDVwJHsVUQRzQwvk8AGLdDvK_XZj2ABxmlxuR4hCe7wwpD9UgMiz1p63L26acZ_ia2QeMe109Jle8IelF5FGALqU6Z-kfG-05IGUk4o6xKE3nAGQmxEdIBT4ERGsjUz4PJITgVTQM" 
               style="max-width: 100%; max-height: 100%; object-fit: contain;">
        </div>
        <div>
          <p class="font-bold text-sm">Liderança Construções</p>
          <p class="text-xs">Rua Fernando Sarney, 171, Vila Marcony</p>
          <p class="text-xs">SANTA INÊS - MA - CEP: 65304-327</p>
          <p class="text-xs">TEL: (98) 98354-0583</p>
        </div>
      </div>

      <!-- DANFE INFO -->
      <div class="col-4 p-2 text-center">
  <p class="font-bold text-lg">PEDIDO</p>
  <p class="text-sm">Nº ${data.id}</p>
  <p class="text-xs mt-2">
    Emitido em:<br>
    ${new Date(data.issue_date).toLocaleString()}
  </p>
</div>
    </div>

    <!-- NATUREZA -->
    <div class="grid grid-12 border-x border-b">
      <div class="col-8 p-1 border-r">
        <span class="danfe-label">NATUREZA DA OPERAÇÃO</span>
        <span class="danfe-value">VENDA DE MERCADORIA ADQUIRIDA DE TERCEIROS</span>
      </div>
      <div class="col-4 p-1">
        <span class="danfe-label">PROTOCOLO DE AUTORIZAÇÃO DE USO</span>
        <span class="danfe-value">---</span>
      </div>
    </div>

    <!-- INSCRIÇÕES -->
    <div class="grid grid-12 border-x border-b">
      <div class="col-4 p-1 border-r">
        <span class="danfe-label">INSCRIÇÃO ESTADUAL</span>
        <span class="danfe-value">---</span>
      </div>
      <div class="col-4 p-1 border-r">
        <span class="danfe-label">INSCRIÇÃO ESTADUAL DO SUBST. TRIB.</span>
        <span class="danfe-value">---</span>
      </div>
      <div class="col-4 p-1">
        <span class="danfe-label">CNPJ</span>
        <span class="danfe-value">---</span>
      </div>
    </div>

    <!-- DESTINATÁRIO -->
    <div class="mt-2 bg-gray p-1 border font-bold text-xs">DESTINATÁRIO / REMETENTE</div>
    <div class="grid grid-12 border-x border-b">
      <div class="col-6 p-1 border-r">
        <span class="danfe-label">NOME / RAZÃO SOCIAL</span>
        <span class="danfe-value">${data.customer_name || ""}</span>
      </div>
      <div class="col-3 p-1 border-r">
        <span class="danfe-label">CÓDIGO</span>
        <span class="danfe-value">${data.customer_id || ""}</span>
      </div>
      <div class="col-3 p-1">
        <span class="danfe-label">CNPJ / CPF</span>
        <span class="danfe-value">${data.customer_cnpj_cpf || ""}</span>
      </div>
    </div>
    <div class="grid grid-12 border-x border-b">
      <div class="col-5 p-1 border-r">
        <span class="danfe-label">ENDEREÇO</span>
        <span class="danfe-value">${address ? (data.customer_logradouro + ", " + data.customer_number) : ""}</span>
      </div>
      <div class="col-4 p-1 border-r">
        <span class="danfe-label">BAIRRO</span>
        <span class="danfe-value">${data.customer_district || ""}</span>
      </div>
      <div class="col-3 p-1">
        <span class="danfe-label">CEP</span>
        <span class="danfe-value"></span>
      </div>
    </div>
    <div class="grid grid-12 border-x border-b">
      <div class="col-5 p-1 border-r">
        <span class="danfe-label">MUNICIPIO</span>
        <span class="danfe-value">${data.customer_city || ""}</span>
      </div>
      <div class="col-3 p-1 border-r">
        <span class="danfe-label">FONE</span>
        <span class="danfe-value">${data.customer_phone || ""}</span>
      </div>
      <div class="col-4 p-1">
        <span class="danfe-label">Email</span>
        <span class="danfe-value">${data.customer_email || ""}</span>
      </div>
    </div>

    <!-- CÁLCULO DE VALORES -->
    <div class="mt-2 bg-gray p-1 border font-bold text-xs">CÁLCULO DE VALORES</div>
    <div class="grid grid-5 border-x border-b">
      <div class="p-1 border-r">
        <span class="danfe-label">BASE DE CÁLC. ICMS</span>
        <span class="danfe-value"></span>
      </div>
      <div class="p-1 border-r">
        <span class="danfe-label">VALOR DO ICMS</span>
        <span class="danfe-value"></span>
      </div>
      <div class="p-1 border-r">
        <span class="danfe-label">VALOR TOTAL PRODUTOS</span>
        <span class="danfe-value">R$ ${Number(totalProduct).toFixed(2)}</span>
      </div>
      <div class="p-1 border-r">
        <span class="danfe-label">DESCONTO</span>
        <span class="danfe-value">R$ ${Number(totalDiscount).toFixed(2)}</span>
      </div>
      <div class="p-1">
        <span class="danfe-label">VALOR TOTAL DA NOTA</span>
        <span class="danfe-value font-bold">R$ ${Number(totalProduct-totalDiscount).toFixed(2)}</span>
      </div>
    </div>

    <!-- OUTRAS INFORMAÇÕES -->
    <div class="mt-2 bg-gray p-1 border font-bold text-xs">OUTRAS INFORMAÇÕES</div>
    <div class="grid grid-4 border-x border-b">
      <div class="p-1 border-r">
        <span class="danfe-label">FORMA DE PAGAMENTO</span>
        <span class="danfe-value"></span>
      </div>
      <div class="p-1 border-r">
        <span class="danfe-label">STATUS</span>
        <span class="danfe-value">${data.status}</span>
      </div>
      <div class="p-1 border-r">
        <span class="danfe-label">VOLUMES</span>
        <span class="danfe-value">${totalQuantity}</span>
      </div>
      <div class="p-1">
        <span class="danfe-label">OBSERVAÇÕES</span>
        <span class="danfe-value"></span>
      </div>
    </div>

    <!-- TABELA PRODUTOS -->
    <div class="mt-2 bg-gray p-1 border font-bold text-xs">DADOS DOS PRODUTOS / SERVIÇOS</div>
    <table class="danfe-table">
      <thead>
        <tr>
          <th style="width:7%">CÓD.</th>
          <th style="width:45%">DESCRIÇÃO</th>
          <th style="width:8%">UN</th>
          <th style="width:10%">QTDE</th>
          <th style="width:12%">V.UNIT</th>
          <th style="width:12%">V.TOTAL</th>
          <th style="width:11%">DESC</th>
        </tr>
      </thead>
      <tbody>
        ${items.rows.map((item) => `
          <tr>
            <td>${item.product_id}</td>
            <td>${item.product_name}</td>
            <td class="text-center">UN</td>
            <td class="text-center">${item.quantity}</td>
            <td class="text-right">${Number(item.unit_price_original).toFixed(2)}</td>
            <td class="text-right">${(item.quantity * item.unit_price).toFixed(2)}</td>
            <td class="text-right">${Number(item.discount_value).toFixed(2) || "0,00"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>
</body>
</html>
  `;
}

module.exports = gerarDanfeHTML;