const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
  symbol: { type: String, unique: true },
  qty: Number,
  avgPrice: Number,
});

module.exports = mongoose.model("Position", positionSchema);
