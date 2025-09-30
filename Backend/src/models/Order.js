const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  side: { type: String, enum: ["BUY", "SELL"], required: true },
  type: { type: String, enum: ["market", "limit"], required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  pnl: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }, // for sorting & charts
  time: { type: String, default: () => new Date().toLocaleTimeString() }, // just HH:MM:SS
});

module.exports = mongoose.model("Order", orderSchema);


