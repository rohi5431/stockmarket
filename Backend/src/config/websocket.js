const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");

const app = express();
const server = http.createServer(app);

// Redis connection
const redis = new Redis(
  process.env.REDIS_URL || "redis://red-d6p4li9r0fns73e45b20:6379"
);

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
  console.log("❌ Redis Error:", err);
});

const io = new Server(server, {
  path: "/ws",
  cors: {
    origin: "*",   // change later to frontend domain
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("subscribeMarket", (room) => {
    socket.join(room);
    console.log(`📡 Client subscribed to ${room}`);
  });

  // Example market updates
  setInterval(() => {
    io.to("stocks").emit("marketUpdate", {
      symbol: "AAPL",
      price: Math.random() * 200
    });
  }, 3000);

  socket.on("disconnect", (reason) => {
    console.log("🔴 Client disconnected:", reason);
  });
});

server.listen(process.env.PORT || 7000, () => {
  console.log("🚀 Server running");
});