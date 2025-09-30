const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  following: { type: [String], default: [] }, // list of strategy symbols followed
});

module.exports = mongoose.model("User", userSchema);
