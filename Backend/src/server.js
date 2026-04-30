require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
// const WebSocket = require("ws"); ❌ disabled
const mongoose = require("mongoose");

const { redisClient, connectRedis } = require("./config/redis");

const Trade = require("./models/Trade");
const Position = require("./models/Position");
const Strategy = require("./models/Strategy");
const History = require("./models/History");

const portfolioRoutes = require("./routes/portfolioRoutes");
const marketRoutes = require("./routes/marketRoutes");
const orderRoutes = require("./routes/orderRoutes");
const aiRoutes = require("./routes/aiRoutes");

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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", portfolioRoutes);
app.use("/api/market", marketRoutes);
app.use("/api", orderRoutes);
app.use("/api/ai", aiRoutes);

// ❌ FINNHUB WEBSOCKET DISABLED (causing 401 error in production)
// const finnhubWS = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);

// ⚠️ Instead simulate data (temporary)
let positions = {};
let portfolioHistory = [];
let pnlHistory = [];
let realizedPnL = 0;
let topMovers = [
  { symbol: "AAPL", price: 150, change: 1.2 },
  { symbol: "TSLA", price: 200, change: -2.5 },
  { symbol: "MSFT", price: 300, change: 0.8 },
  { symbol: "NVDA", price: 450, change: 3.4 },
  { symbol: "AMZN", price: 130, change: -1.1 }
];

// 🔥 Simulate updates every 3 sec
setInterval(async () => {
  topMovers = topMovers.map((t) => {
    const priceChange = (Math.random() - 0.5) * 5;
    const newPrice = +(t.price + priceChange).toFixed(2);
    const newChange = +((priceChange / t.price) * 100).toFixed(2);
    return {
      ...t,
      price: newPrice,
      change: newChange
    };
  });

  const time = new Date().toLocaleTimeString();

  portfolioHistory.push({ time, value: Math.random() * 10000 });
  pnlHistory.push({ time, value: Math.random() * 1000 });

  if (portfolioHistory.length > 20) portfolioHistory.shift();
  if (pnlHistory.length > 20) pnlHistory.shift();

  await redisClient.setEx("stock:portfolioHistory", 5, JSON.stringify(portfolioHistory));
  await redisClient.setEx("stock:pnlHistory", 5, JSON.stringify(pnlHistory));
  await redisClient.setEx("stock:topMovers", 5, JSON.stringify(topMovers));

  io.emit("portfolioUpdate", portfolioHistory);
  io.emit("pnlUpdate", pnlHistory);
  io.emit("marketUpdate", topMovers);
}, 3000);

io.on("connection", async (socket) => {
  console.log("⚡ Client connected:", socket.id);

  const cachedPortfolio = await redisClient.get("stock:portfolioHistory");
  const cachedPnL = await redisClient.get("stock:pnlHistory");
  const cachedTopMovers = await redisClient.get("stock:topMovers");

  if (cachedPortfolio)
    socket.emit("portfolioUpdate", JSON.parse(cachedPortfolio));

  if (cachedPnL)
    socket.emit("pnlUpdate", JSON.parse(cachedPnL));

  if (cachedTopMovers)
    socket.emit("marketUpdate", JSON.parse(cachedTopMovers));

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT1 || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});