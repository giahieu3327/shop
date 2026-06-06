const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ dùng connection pool (fix fatal error)
const db = mysql.createPool({
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'shopdb',
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10
});

// 🔍 test kết nối
db.getConnection((err, conn) => {
  if (err) {
    console.log("❌ DB connection lỗi:", err);
  } else {
    console.log("✅ MySQL connected");
    conn.release();
  }
});

// middleware log
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// PRODUCTS
app.get('/api/products', (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      console.log("🔥 SQL ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

// REGISTER
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  db.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    (err) => {
      if (err) {
        console.log("🔥 REGISTER ERROR:", err);
        return res.status(500).json(err);
      }
      res.send("OK");
    }
  );
});

// LOGIN
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) {
        console.log("🔥 LOGIN ERROR:", err);
        return res.status(500).json(err);
      }

      if (result.length === 0)
        return res.status(401).send("Sai tài khoản");

      res.json(result[0]);
    }
  );
});

// CREATE ORDER
app.post('/api/order', (req, res) => {
  const { user_id, product_id } = req.body;

  db.query(
    "INSERT INTO orders (user_id, product_id) VALUES (?, ?)",
    [user_id, product_id],
    (err) => {
      if (err) {
        console.log("🔥 ORDER ERROR:", err);
        return res.status(500).json(err);
      }
      res.send("OK");
    }
  );
});

// GET ORDERS
app.get('/api/orders/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  db.query(`
    SELECT o.id, p.name, p.price, o.created_at
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE o.user_id = ?
  `, [user_id], (err, result) => {
    if (err) {
      console.log("🔥 ORDERS ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

app.listen(5000, () => {
  console.log("🚀 Backend chạy port 5000");
});
