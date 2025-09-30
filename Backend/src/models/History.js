const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  type: { type: String, enum: ["portfolio", "pnl"] }, // track which history
  time: String,
  value: Number,
});

module.exports = mongoose.model("History", historySchema);
