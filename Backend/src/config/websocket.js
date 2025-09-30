const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  path: "/ws", // ✅ matches frontend
  cors: {
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("subscribeMarket", (room) => {
    socket.join(room);
    console.log(`📡 Client subscribed to ${room}`);
  });

  // Example: emit market updates
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

server.listen(7000, () => {
  console.log("🚀 Server listening on http://localhost:7000");
});
