// index.js
import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: [
      "https://fundgoal.fun",
      "https://fund-goal-dot-fun-frontend.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

// Root test
app.get("/", (req, res) => {
  res.send("✅ Backend server is running!");
});

// GET: /api/tokens — list all tokens
app.get("/api/tokens", (req, res) => {
  res.json({
    tokens: [
      { ca: "0x1", name: "Token One", symbol: "TK1", price: 1.23 },
      { ca: "0x2", name: "Token Two", symbol: "TK2", price: 4.56 },
    ],
  });
});

// GET: /api/tokens/:ca — get token by contract address
app.get("/api/tokens/:ca", (req, res) => {
  const { ca } = req.params;
  res.json({
    token: {
      ca,
      name: "Token " + ca.slice(-4),
      symbol: "TK" + ca.slice(-2),
      price: 9.99,
    },
  });
});

// GET: /api/tokens/ticker/list — list of token tickers
app.get("/api/tokens/ticker/list", (req, res) => {
  res.json({
    tickers: [
      { symbol: "TK1", price: 1.23 },
      { symbol: "TK2", price: 4.56 },
      { symbol: "SOLX", price: 23.45 },
    ],
  });
});

// GET: /api/solana-tokens — simulate search + pagination
app.get("/api/solana-tokens", (req, res) => {
  const { q = "", page = 1 } = req.query;
  res.json({
    tokens: [
      {
        name: `SolanaToken-${q || "Default"}-${page}`,
        symbol: "SOLX",
        rank: 1,
      },
      {
        name: `AnotherToken-${q || "Default"}-${page}`,
        symbol: "SLY",
        rank: 2,
      },
    ],
    page,
    query: q,
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`✅ Backend ready on http://localhost:${port}`);
});