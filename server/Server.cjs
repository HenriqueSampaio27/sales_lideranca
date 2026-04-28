require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const puppeteer = require("puppeteer");
const crypto = require("crypto");
const gerarDanfeHTML = require("./danfeTemplate.cjs")
const { exec } = require('child_process');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log("Servidor rodando na porta", PORT);

});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      origin.startsWith('http://192.168.3.') ||
      origin === 'http://localhost:3000' ||
      origin === 'https://henriquesampaio27.github.io'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', "PATCH", 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

const fs = require('fs');

app.get('/backup', async (req, res) => {
  const fileName = `backup-${Date.now()}.sql`;
  const dir = path.resolve('./backups');

  // cria pasta se não existir
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = path.join(dir, fileName);

  const command = `pg_dump ${process.env.DATABASE_URL} -f "${filePath}"`;

  exec(command, (error) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao gerar backup' });
    }

    res.download(filePath);
  });
});

// 🔐 LOGIN
app.post('/login', async (req, res) => {
    try {
        // Use os nomes EXATOS que apareceram no seu console log
        const { username, password } = req.body; 

        console.log("Tentando login para:", username);

        // Exemplo de como ficaria a busca no Postgres (pg)
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        // Verificação da senha com bcrypt (já que está no seu package.json)
        const senhaValida = await bcrypt.compare(password, user.password);

        if (!senhaValida) {
            return res.status(401).json({ message: "Senha incorreta" });
        }

        // Se chegou aqui, login sucesso! (Aqui você geraria o JWT)
        res.json({ message: "Login realizado com sucesso!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
});

app.post("/clients", async (req, res) => {
  try {
    const { name, phone, cnpj_cpf, email, logradouro, district, number, city } = req.body;

    const query = `
      INSERT INTO customer 
      (name, phone, cnpj_cpf, email, logradouro, district, number, city)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;

    const values = [name, phone, cnpj_cpf, email, logradouro, district, number, city];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: "Cliente salvo com sucesso",
      client: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao salvar cliente" });
  }
});

app.get("/clients", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customer");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar clientes" });
  }
});

app.get('/clients/today', async (req, res) => {
  const result = await pool.query(`
    SELECT COUNT(*) 
    FROM customer
    WHERE DATE(created_at) = CURRENT_DATE
  `);

  res.json({ total: result.rows[0].count });
});

app.delete('/clients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM customer WHERE id = $1', [id]);
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
});

app.put('/clients/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    cnpj_cpf,
    phone,
    email,
    logradouro,
    number,
    city,
    district
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE customer
       SET name = $1,
           cnpj_cpf = $2,
           phone = $3,
           email = $4,
           logradouro = $5,
           number = $6,
           city = $7,
           district = $8
       WHERE id = $9
       RETURNING *`,
      [name, cnpj_cpf, phone, email, logradouro, number, city, district, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
});

app.post('/product', upload.single("image"), async (req, res) => {
  const { product_name, barcode, sale_price, price_cost, stock, sku, mark, unit, minStock, discount } = req.body;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      `INSERT INTO product 
      (product_name, barcode, sale_price, price_cost, stock, sku, mark, unit, "minStock", discount, image)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [product_name, barcode, sale_price, price_cost, stock, sku, mark, unit, minStock, discount, imagePath]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Erro detalhado:", err);

    // 👇 erro de constraint (ex: barcode duplicado)
    if (err.code === "23505") {
      return res.status(400).json({
        message: "Produto com esse código de barras já existe"
      });
    }

    // 👇 campo obrigatório vazio
    if (err.code === "23502") {
      return res.status(400).json({
        message: `Campo obrigatório não informado: ${err.column}`
      });
    }

    // 👇 erro genérico do banco
    return res.status(500).json({
      message: err.message || "Erro ao salvar produto"
    });
  }
});

app.get('/product', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

app.put('/product/:id', upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { product_name, barcode, sale_price, price_cost, stock, sku, mark, unit, minStock, discount } = req.body;

  const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image;

  try {
    const result = await pool.query(
      `UPDATE product SET
        product_name = $1,
        barcode = $2,
        sale_price = $3,
        price_cost = $4,
        stock = $5,
        "unit" = $6,
        sku = $7,
        mark = $8,
        "minStock" = $9,
        discount = $10,
        image = $11
       WHERE id = $12
       RETURNING *`,
      [product_name, barcode, sale_price, price_cost, stock, unit, sku, mark, minStock, discount, imagePath, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    //res.status(500).json({ error: "Erro ao atualizar produto" });
    console.error("ERRO UPDATE:", err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/product/:id/active', async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE product SET active = $1 WHERE id = $2 RETURNING *`,
      [active, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar active" });
  }
});

app.delete('/product/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM product WHERE id = $1", [id]);
    res.json({ message: "Produto deletado" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

app.post("/invoices", async (req, res) => {
  const client = await pool.connect();

  try {
    const {
  customer_id,
  user_id,
  items,
  status,
  is_paid,
  payment_method,
  pending_info
} = req.body;

    const dueDate = !is_paid ? pending_info?.dueDate : null;
    const total_paid = !is_paid ? pending_info?.advanceAmount : null;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Sem itens na venda" });
    }

    await client.query("BEGIN");

    // 🔹 Calcular total
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += Number(item.unit_price_final) * Number(item.quantity);
    }

    // 🔹 Criar invoice
    const invoiceResult = await client.query(
      `INSERT INTO invoices 
      (invoice_number, customer_id, user_id, issue_date, total_amount, tax_amount, status, due_date, is_paid, total_paid)
      VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9)
      RETURNING id`,
      [
        "NF-" + crypto.randomUUID().slice(0,8),
        customer_id || null,
        user_id || null,
        totalAmount,
        0,
        status,
        dueDate || null,
        is_paid,
        total_paid ?? 0
      ]
    );

    const invoiceId = invoiceResult.rows[0].id;

    // 🔹 Inserir itens + atualizar estoque
    for (const item of items) {
      const itemTotal =
        Number(item.unit_price_final) * Number(item.quantity);

      // Inserir item
      await client.query(
        `INSERT INTO invoice_items
        (invoice_id, product_id, quantity, 
          unit_price_original,
          discount_value,
          unit_price,
          sale_type,
          item_total)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [
          invoiceId,
          item.product_id,
          item.quantity,
          item.unit_price_original,
          item.discount_value,
          item.unit_price_final,
          item.sale_type,
          itemTotal
        ]
      );

      // Atualizar estoque com proteção
      const stockUpdate = await client.query(
        `UPDATE product
         SET stock = stock - $1
         WHERE id = $2
         AND stock >= $1`,
        [item.quantity, item.product_id]
      );

      if (stockUpdate.rowCount === 0) {
        throw new Error("Estoque insuficiente");
      }
    }

    if (Array.isArray(payment_method)) {
      for (const payment of payment_method) {
        await client.query(
          `INSERT INTO invoice_payments
          (invoice_id, method, value)
          VALUES ($1,$2,$3)`,
          [invoiceId, payment.method, payment.value]
        );
      }
    } else {
      await client.query(
        `INSERT INTO invoice_payments
        (invoice_id, method, value)
        VALUES ($1,$2,$3)`,
        [invoiceId, payment_method, totalAmount]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Venda salva com sucesso",
      invoice_id: invoiceId,
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Erro na venda:", error);

    // 🔴 erro de estoque
    if (error.message === "Estoque insuficiente") {
      return res.status(400).json({
        message: "Estoque insuficiente para um ou mais produtos"
      });
    }

    // 🔴 erro de constraint do PostgreSQL
    if (error.code === "23503") {
      return res.status(400).json({
        message: "Cliente ou produto inválido"
      });
    }

    // 🔴 erro campo obrigatório
    if (error.code === "23502") {
      return res.status(400).json({
        message: `Campo obrigatório não informado: ${error.column}`
      });
    }

    // 🔴 fallback
    return res.status(500).json({
      message: error.message || "Erro ao finalizar venda"
    });
  } finally {
    client.release();
  }
});

app.get("/invoices", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.*,
        c.name AS customer_name
      FROM invoices i
      LEFT JOIN customer c ON c.id = i.customer_id
      ORDER BY i.issue_date DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao buscar notas"
    });
  }
});

app.get("/invoices/chart", async (req, res) => {
  const { period } = req.query;

  let interval = "30 days";
  let groupFormat = "DD/MM";
  let groupBy = "DATE(issue_date)";

  switch (period) {
    case "3m":
      interval = "3 months";
      groupFormat = "MM/YYYY";
      groupBy = "DATE_TRUNC('month', issue_date)";
      break;

    case "6m":
      interval = "6 months";
      groupFormat = "MM/YYYY";
      groupBy = "DATE_TRUNC('month', issue_date)";
      break;

    case "1y":
      interval = "1 year";
      groupFormat = "MM/YYYY";
      groupBy = "DATE_TRUNC('month', issue_date)";
      break;

    case "2y":
      interval = "2 years";
      groupFormat = "YYYY";
      groupBy = "DATE_TRUNC('year', issue_date)";
      break;
  }

  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(${groupBy}, '${groupFormat}') AS name,
        COALESCE(SUM(total_amount::numeric),0) AS sales
      FROM invoices
      WHERE issue_date >= NOW() - INTERVAL '${interval}'
      GROUP BY ${groupBy}
      ORDER BY ${groupBy} ASC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar gráfico" });
  }
});

app.get('/financial-notes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.*,
        c.name AS customer_name,
        c.cnpj_cpf AS cnpj_cpf,

        COALESCE(
          json_agg(
            json_build_object(
              'product_id', ii.product_id,
              'product_name', p.product_name,
              'quantity', ii.quantity,
              'unit_price', ii.unit_price,
              'unit_price_original', ii.unit_price_original,
              'discount_value', ii.discount_value,
              'item_total', ii.item_total
            )
          ) FILTER (WHERE ii.id IS NOT NULL),
          '[]'
        ) AS items

      FROM invoices i
      LEFT JOIN customer c ON c.id = i.customer_id
      LEFT JOIN invoice_items ii ON ii.invoice_id = i.id
      LEFT JOIN product p ON p.id = ii.product_id

      GROUP BY i.id, c.id
      ORDER BY i.id DESC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar notas" });
  }
});

app.put('/invoices/:id/pay', async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {

    const invoice = await pool.query(
      "SELECT total_paid, total_amount FROM invoices WHERE id = $1",
      [id]
    );

    if (invoice.rows.length === 0) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }

    const totalPaid = Number(invoice.rows[0].total_paid);
    const totalAmount = Number(invoice.rows[0].total_amount);

    let newTotalPaid = totalPaid + Number(amount);

    if (newTotalPaid > totalAmount) {
      newTotalPaid = totalAmount;
    }

    const status = newTotalPaid >= totalAmount ? "PAGO" : "PENDENTE";

    await pool.query(
      `UPDATE invoices
       SET total_paid = $1,
           status = $2
       WHERE id = $3`,
      [newTotalPaid, status, id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao registrar pagamento" });
  }
});

app.delete('/invoices/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // 1️⃣ Buscar itens da nota
    const items = await client.query(
      `SELECT product_id, quantity 
       FROM invoice_items
       WHERE invoice_id = $1`,
      [id]
    );

    // 2️⃣ Devolver estoque
    for (const item of items.rows) {

      await client.query(
        `UPDATE product
         SET stock = stock + $1
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );

    }

    // 3️⃣ Deletar pagamentos
    await client.query(
      `DELETE FROM invoice_payments
       WHERE invoice_id = $1`,
      [id]
    );

    // 4️⃣ Deletar itens
    await client.query(
      `DELETE FROM invoice_items
       WHERE invoice_id = $1`,
      [id]
    );

    // 5️⃣ Deletar nota
    await client.query(
      `DELETE FROM invoices
       WHERE id = $1`,
      [id]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Nota deletada e estoque restaurado"
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      error: "Erro ao deletar nota"
    });

  } finally {

    client.release();

  }
});

async function generateDanfePDF(invoiceId) {

  const invoice = await pool.query(
    `SELECT i.*, 
      c.id          AS customer_id,
      c.name        AS customer_name,
      c.cnpj_cpf    AS customer_cnpj_cpf,
      c.phone       AS customer_phone,
      c.email       AS customer_email,
      c.logradouro  AS customer_logradouro,
      c.number      AS customer_number,
      c.city        AS customer_city,
      c.district    AS customer_district,
      c.created_at  AS customer_created_at
     FROM invoices i
     LEFT JOIN customer c ON c.id = i.customer_id
     WHERE i.id = $1`,
    [invoiceId]
  );

  if (invoice.rows.length === 0) {
    throw new Error("Nota não encontrada");
  }

  const items = await pool.query(
    `SELECT ii.*, p.product_name
     FROM invoice_items ii
     JOIN product p ON p.id = ii.product_id
     WHERE ii.invoice_id = $1`,
    [invoiceId]
  );

  const data = invoice.rows[0];
  const html = gerarDanfeHTML(data, items);

  
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ],
      headless: "new"
    });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div></div>`,
    footerTemplate: `
      <div style="width:100%; font-size:8px; padding:0 10mm; text-align:right;">
        Página <span class="pageNumber"></span> de <span class="totalPages"></span>
      </div>
    `,
    margin: {
      top: "0mm",
      right: "0mm",
      bottom: "0mm",
      left: "0mm",
    },
  });

  await browser.close();

  return pdfBuffer; // 🔥 AGORA RETORNA O PDF
}

app.get("/generate-danfe/:id", async (req, res) => {
  const invoiceId = req.params.id;

  try {
    const invoice = await pool.query(
      `SELECT i.*, 
      c.id          AS customer_id,
      c.name        AS customer_name,
      c.cnpj_cpf    AS customer_cnpj_cpf,
      c.phone       AS customer_phone,
      c.email       AS customer_email,
      c.logradouro  AS customer_logradouro,
      c.number      AS customer_number,
      c.city        AS customer_city,
      c.district    AS customer_district,
      c.created_at  AS customer_created_at
       FROM invoices i
       LEFT JOIN customer c ON c.id = i.customer_id
       WHERE i.id = $1`,
      [invoiceId]
    );

    if (invoice.rows.length === 0) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }

    const items = await pool.query(
      `SELECT ii.*, p.product_name
      FROM invoice_items ii
      JOIN product p ON p.id = ii.product_id
      WHERE ii.invoice_id = $1`,
      [invoiceId]
    );

    const data = invoice.rows[0];
    console.log(data)
    console.log(items)
  const html = gerarDanfeHTML(data, items);

    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ],
      headless: "new"
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,

  headerTemplate: `<div></div>`,

  footerTemplate: `
    <div style="
      width:100%;
      font-size:8px;
      padding:0 10mm;
      text-align:right;
    ">
      Página <span class="pageNumber"></span> de <span class="totalPages"></span>
    </div>
  `,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });
    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=danfe-${invoiceId}.pdf`,
    });

    res.send(pdf);

  } catch (error) {
    console.error("ERRO REAL:", error);
    res.status(500).json({ error: error.message });
  }
});




const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);


app.post("/invoices/:id/send-email", async (req, res) => {
  const { id } = req.params;

  console.log("Rota de envio chamada para nota:", id);

  try {
    // 1️⃣ Buscar cliente da nota
    const invoiceResult = await pool.query(
      "SELECT customer_id FROM invoices WHERE id = $1",
      [id]
    );

    if (invoiceResult.rows.length === 0) {
      return res.status(404).json({ error: "Nota não encontrada" });
    }

    const customerId = invoiceResult.rows[0].customer_id;

    if (!customerId) {
      return res.status(400).json({
        error: "Nota não possui cliente vinculado",
      });
    }

    // 2️⃣ Buscar email do cliente
    const customerResult = await pool.query(
      "SELECT email FROM customer WHERE id = $1",
      [customerId]
    );

    if (
      customerResult.rows.length === 0 ||
      !customerResult.rows[0].email
    ) {
      return res.status(400).json({
        error: "Cliente não possui email cadastrado",
      });
    }

    const email = customerResult.rows[0].email;

    // 3️⃣ Gerar PDF em memória (IMPORTANTE)
    const pdfBuffer = await generateDanfePDF(id);
    // ⚠ Aqui você precisa ter essa função retornando Buffer

    // 4️⃣ Enviar email
    await transporter.sendMail({
      from: `"Sua Empresa" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Nota Fiscal #${id}`,
      text: "Segue em anexo sua nota fiscal.",
      attachments: [
        {
          filename: `nota-${id}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return res.json({
      success: true,
      message: "Email enviado com sucesso",
    });

  } catch (err) {
    console.error("Erro ao enviar email:", err);
    return res.status(500).json({
      error: "Erro ao enviar email",
    });
  }
});

app.post('/duplicates', async (req, res) => {
  console.log("🔥 CHEGOU NA ROTA DUPLICATES");
  console.log(req.body);
  try {
    const { client, cnpj, document, dueDate, value, status } = req.body;

    // validação básica
    if (!client || !document || !dueDate || !value) {
      return res.status(400).json({
        message: "Campos obrigatórios não informados"
      });
    }

    const result = await pool.query(
      `INSERT INTO duplicates 
      (client, cnpj, document, due_date, value, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        client,
        cnpj || null,
        document,
        dueDate,
        value,
        status || 'pending'
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Erro ao salvar duplicata:", error);

    // erro de campo obrigatório
    if (error.code === "23502") {
      return res.status(400).json({
        message: `Campo obrigatório não informado: ${error.column}`
      });
    }

    res.status(500).json({
      message: "Erro ao salvar duplicata"
    });
  }
});

app.get('/duplicates', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM duplicates ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao buscar duplicatas"
    });
  }
});

app.patch('/duplicates/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE duplicates
      SET status = 'paid'
      WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Duplicata não encontrada' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao confirmar pagamento' });
  }
});

app.delete('/duplicates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM duplicates WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Duplicata não encontrada' });
    }

    res.json({ message: 'Duplicata deletada com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao deletar duplicata' });
  }
});

//app.listen(5000, () => console.log("Servidor rodando na porta 5000"));
