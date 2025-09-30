const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  symbol: String,
  type: { type: String, enum: ["BUY", "SELL"] },
  qty: Number,
  price: Number,
  pnl: Number,
  date: String,
  time: String,
});

module.exports = mongoose.model("Trade", tradeSchema);
