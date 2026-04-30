import { io } from "socket.io-client";

// WebSocket server URL
import { STRATEGY } from "../config/api";

const SOCKET_URL = STRATEGY;

// Create the socket connection
export const socket = io(SOCKET_URL, {
  path: "/ws",                // must match server path
  transports: ["websocket"],  // force WebSocket transport
  reconnection: true,         // auto-reconnect
  reconnectionAttempts: 5,    // retry up to 5 times
  reconnectionDelay: 2000,    // wait 2s between retries
});

// Connection events
socket.on("connect", () => {
  console.log("Connected to WebSocket:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from WebSocket:", reason);
});

// Subscribe to a market room
export const subscribeMarket = (room) => {
  socket.emit("subscribeMarket", room);
  console.log(`Subscribed to room: ${room}`);
};

// Listen for market updates
export const onMarketUpdate = (callback) => {
  socket.on("marketUpdate", callback);
};

// Stop listening to market updates
export const offMarketUpdate = () => {
  socket.off("marketUpdate");
};

export const subscribeMentors = () => {
  socket.emit("subscribe", { room: "mentors" });
};

// Optional: unsubscribe
export const unsubscribeMentors = () => {
  socket.emit("unsubscribe", { room: "mentors" });
};
