require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const { redisClient, connectRedis } = require("./config/redis");

const authRoutes = require("./routes/authRoutes");
const strategiesRoutes = require("./routes/strategyRoutes");


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
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
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/strategies", strategiesRoutes);

let strategies = [
  { symbol: "AAPL", name: "Apple", roi: 5.2, return: 1200, followers: 100, winRate: 75 },
  { symbol: "TSLA", name: "Tesla", roi: 12.3, return: 2100, followers: 150, winRate: 80 },
];

setInterval(async () => {
  strategies = strategies.map((s) => ({
    ...s,
    roi: +(s.roi + (Math.random() - 0.5)).toFixed(2),
    return: +(s.return + Math.floor(Math.random() * 50 - 25)),
  }));

  const strategiesForClient = strategies.map((s) => ({
    symbol: s.symbol,
    name: s.name,
    roi: `${s.roi > 0 ? "+" : ""}${s.roi}%`,
    return: `$${s.return}`,
    followers: s.followers,
    winRate: `${s.winRate}%`,
  }));

  await redisClient.setEx(
    "stock:strategies",
    5,
    JSON.stringify(strategiesForClient)
  );

  io.emit("strategiesUpdate", strategiesForClient);
}, 5000);

io.on("connection", async (socket) => {
  console.log("New client connected");

  const cachedStrategies = await redisClient.get("stock:strategies");

  if (cachedStrategies)
    socket.emit("strategiesUpdate", JSON.parse(cachedStrategies));

  socket.on("disconnect", () =>
    console.log("Client disconnected")
  );
});

const PORT = process.env.PORT2 || 7000;

server.listen(PORT, () => {
  console.log(`📡 WebSocket server running on http://localhost:${PORT}`);
});