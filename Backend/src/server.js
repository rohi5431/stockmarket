require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const WebSocket = require("ws");
const mongoose = require("mongoose");

// Redis client
const { redisClient, connectRedis } = require("./config/redis");

// Models
const Trade = require("./models/Trade");
const Position = require("./models/Position");
const Strategy = require("./models/Strategy");
const History = require("./models/History");

const portfolioRoutes = require("./routes/portfolioRoutes");
const marketRoutes = require("./routes/marketRoutes");
const orderRoutes = require("./routes/orderRoutes");

const { trades } = require("./models/Portfolio");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
  path: "/ws",
});

connectRedis();
app.get("/", async (req, res) => {
  await redisClient.set("test-key", "Hello Cloud Redis");
  const value = await redisClient.get("test-key");
  res.send(`Redis says: ${value}`);
});

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const Origins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (Origins.indexOf(origin) === -1) {
        return callback(new Error("Origin not allowed"), false);
      }

      return callback(null, true);
    },
  })
);

app.use(express.json());

app.use("/api", portfolioRoutes);
app.use("/api/market", marketRoutes);
app.use("/api", orderRoutes);

const finnhubWS = new WebSocket(
  `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`
);

let positions = {};
let portfolioHistory = [];
let pnlHistory = [];
let realizedPnL = 0;
let topMovers = [];

finnhubWS.on("open", () => {
  console.log("Connected to Finnhub WebSocket");

  ["AAPL", "TSLA", "MSFT", "NVDA"].forEach((symbol) => {
    finnhubWS.send(JSON.stringify({ type: "subscribe", symbol }));
  });
});

finnhubWS.on("message", async (msg) => {
  try {
    const data = JSON.parse(msg);

    if (data.type === "trade") {
      data.data.forEach((tradeData) => {
        const symbol = tradeData.s;
        const price = tradeData.p;

        const qty = Math.floor(Math.random() * 10) + 1;
        const type = Math.random() > 0.5 ? "BUY" : "SELL";

        const tradeEntry = {
          symbol,
          type,
          qty,
          price,
          pnl: 0,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        };

        trades.push(tradeEntry);
        if (trades.length > 50) trades.shift();

        if (!positions[symbol]) {
          positions[symbol] = { qty: 0, avgPrice: 0 };
        }

        const pos = positions[symbol];

        if (type === "BUY") {
          const totalCost = pos.avgPrice * pos.qty + price * qty;
          pos.qty += qty;
          pos.avgPrice = totalCost / pos.qty;
        } else {
          const sellQty = Math.min(qty, pos.qty);

          if (sellQty > 0) {
            const pnl = sellQty * (price - pos.avgPrice);
            realizedPnL += pnl;
            pos.qty -= sellQty;
            tradeEntry.pnl = pnl;
          }
        }

        const idx = topMovers.findIndex((t) => t.symbol === symbol);

        if (idx >= 0) {
          topMovers[idx].price = price;
        } else {
          topMovers.push({
            symbol,
            price,
            change: 0,
            prevClose: price,
          });
        }
      });

      let portfolioValue = 0;

      for (let sym in positions) {
        const pos = positions[sym];
        const marketPrice =
          topMovers.find((t) => t.symbol === sym)?.price || 0;

        portfolioValue += pos.qty * marketPrice;
      }

      let unrealizedPnL = 0;

      for (let sym in positions) {
        const pos = positions[sym];
        const marketPrice =
          topMovers.find((t) => t.symbol === sym)?.price || 0;

        unrealizedPnL += (marketPrice - pos.avgPrice) * pos.qty;
      }

      const totalPnL = unrealizedPnL + realizedPnL;
      const time = new Date().toLocaleTimeString();

      portfolioHistory.push({ time, value: portfolioValue });
      pnlHistory.push({ time, value: totalPnL });

      if (portfolioHistory.length > 20) portfolioHistory.shift();
      if (pnlHistory.length > 20) pnlHistory.shift();

      await redisClient.setEx(
        "stock:portfolioHistory",
        5,
        JSON.stringify(portfolioHistory)
      );

      await redisClient.setEx(
        "stock:pnlHistory",
        5,
        JSON.stringify(pnlHistory)
      );

      await redisClient.setEx(
        "stock:trades",
        5,
        JSON.stringify(trades)
      );

      await redisClient.setEx(
        "stock:topMovers",
        5,
        JSON.stringify(topMovers)
      );

      io.emit("portfolioUpdate", portfolioHistory);
      io.emit("pnlUpdate", pnlHistory);
      io.emit("tradesUpdate", trades);
      io.emit("marketUpdate", topMovers);
    }
  } catch (err) {
    console.error("Error processing message:", err.message);
  }
});

io.on("connection", async (socket) => {
  console.log("⚡ Client connected:", socket.id);

  const cachedPortfolio = await redisClient.get("stock:portfolioHistory");
  const cachedPnL = await redisClient.get("stock:pnlHistory");
  const cachedTrades = await redisClient.get("stock:trades");
  const cachedTopMovers = await redisClient.get("stock:topMovers");

  if (cachedPortfolio)
    socket.emit("portfolioUpdate", JSON.parse(cachedPortfolio));

  if (cachedPnL) socket.emit("pnlUpdate", JSON.parse(cachedPnL));

  if (cachedTrades) socket.emit("tradesUpdate", JSON.parse(cachedTrades));

  if (cachedTopMovers)
    socket.emit("marketUpdate", JSON.parse(cachedTopMovers));

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT1 || 5000;

server.listen(PORT, () => {
  console.log(`REST API running on http://localhost:${PORT}`);
});