require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const WebSocket = require("ws");
const axios = require("axios");
const mongoose = require("mongoose");
const redis = require("redis");

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
const io = new Server(server, { cors: { origin: "*" }, path: "/ws" });

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// ===== Redis Setup =====
const redisClient = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});
redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.connect().then(() => {
  console.log("Redis connected");
});

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


const Origins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: function (origin, callback) {
      if(!origin){ 
        return callback(null, true);
      }
      if(Origins.indexOf(origin) === -1){ 
        return callback(new Error("Origin not allowed"), false);
      }
      return callback(null, true);
    },
  })
);
app.use(express.json());

// ===== Routes =====
app.use("/api", portfolioRoutes);
app.use("/api/market", marketRoutes);
app.use("/api", orderRoutes);

// ===== WebSocket to Finnhub =====
const finnhubWS = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);
let positions = {};
let portfolioHistory = [];
let pnlHistory = [];
let realizedPnL = 0;
let topMovers = [];

finnhubWS.on("open", () => {
  console.log("Connected to Finnhub WebSocket");
  ["AAPL", "TSLA", "MSFT", "NVDA"].forEach((symbol) =>
    finnhubWS.send(JSON.stringify({ type: "subscribe", symbol }))
  );
});

finnhubWS.on("message", async (msg) => {
  try{
    const data = JSON.parse(msg);
    if(data.type === "trade"){
      data.data.forEach((tradeData) => {
        const symbol = tradeData.s;
        const price = tradeData.p;
        const qty = Math.floor(Math.random() * 10) + 1;
        const type = Math.random() > 0.5 ? "BUY" : "SELL";

        // Trade entry
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
        if(trades.length > 50){
           trades.shift();
        }
        // Update positions
        if(!positions[symbol]) positions[symbol] = { qty: 0, avgPrice: 0 };
        const pos = positions[symbol];
        if(type === "BUY"){
          const totalCost = pos.avgPrice * pos.qty + price * qty;
          pos.qty += qty;
          pos.avgPrice = totalCost / pos.qty;
        } 
        else if(type === "SELL"){
          const sellQty = Math.min(qty, pos.qty);
          if(sellQty > 0){
            const pnl = sellQty * (price - pos.avgPrice);
            realizedPnL += pnl;
            pos.qty -= sellQty;
            tradeEntry.pnl = pnl;
          }
        }

        // Update top movers
        const idx = topMovers.findIndex((t) => t.symbol === symbol);
        if(idx >= 0){
           topMovers[idx].price = price;
        }
        else{
          topMovers.push({ symbol, price, change: 0, prevClose: price });
        }
      })
      // Portfolio value
      let portfolioValue = 0;
      for(let sym in positions){
        const pos = positions[sym];
        const marketPrice = topMovers.find((t) => t.symbol === sym)?.price || 0;
        portfolioValue += pos.qty * marketPrice;
      }

      let unrealizedPnL = 0;
      for(let sym in positions){
        const pos = positions[sym];
        const marketPrice = topMovers.find((t) => t.symbol === sym)?.price || 0;
        unrealizedPnL += (marketPrice - pos.avgPrice) * pos.qty;
      }

      const totalPnL = unrealizedPnL + realizedPnL;
      const time = new Date().toLocaleTimeString();

      portfolioHistory.push({ time, value: portfolioValue });
      pnlHistory.push({ time, value: totalPnL });
      if(portfolioHistory.length > 20){
        portfolioHistory.shift();
      }
      if(pnlHistory.length > 20){ 
        pnlHistory.shift();
      }
      // ===== Cache data =====
      await redisClient.setEx("portfolioHistory", 5, JSON.stringify(portfolioHistory));
      await redisClient.setEx("pnlHistory", 5, JSON.stringify(pnlHistory));
      await redisClient.setEx("trades", 5, JSON.stringify(trades));
      await redisClient.setEx("topMovers", 5, JSON.stringify(topMovers));

      io.emit("portfolioUpdate", portfolioHistory);
      io.emit("pnlUpdate", pnlHistory);
      io.emit("tradesUpdate", trades);
      io.emit("marketUpdate", topMovers);
    }
  }
  catch(err){
    console.error("Error processing message:", err.message);
  }
});

// ===== WebSocket connection for clients =====
io.on("connection", async (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // Send cached data on connect
  const cachedPortfolio = await redisClient.get("portfolioHistory");
  const cachedPnL = await redisClient.get("pnlHistory");
  const cachedTrades = await redisClient.get("trades");
  const cachedTopMovers = await redisClient.get("topMovers");

  if(cachedPortfolio){ 
    socket.emit("portfolioUpdate", JSON.parse(cachedPortfolio));
  }
  if(cachedPnL){ 
    socket.emit("pnlUpdate", JSON.parse(cachedPnL));
  }
  if(cachedTrades){
    socket.emit("tradesUpdate", JSON.parse(cachedTrades)); 
  }
  if(cachedTopMovers){
    socket.emit("marketUpdate", JSON.parse(cachedTopMovers));
  }

  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});


const PORT3 = process.env.PORT1 || 5000;
server.listen(PORT3, () => {
  console.log(`REST API running on http://localhost:${PORT3}`);
});