// src/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "stockMarket",
    });
    console.log("MongoDB connected");
  } 
  catch(err){
    console.error("MongoDB connection failed", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
