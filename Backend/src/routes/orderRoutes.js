const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ Create new order
router.post("/api/create_order", async (req, res) => {
  const { symbol, side, orderType, qty, price, pnl, time } = req.body;

  try{
    // ✅ Create and save order (matches schema field names)
    const order = new Order({
      symbol,
      side: side?.toUpperCase(),      // normalize to "BUY" or "SELL"
      type: orderType,                // match schema field 'type'
      qty,
      price,
      pnl: pnl || 0,
      time: time ? new Date(time) : new Date(), // fallback to current time
    });

    await order.save();

    res.status(201).json({
      message: "Order saved successfully",
      order,
    });
  } 
  catch(err){
    console.error("Error saving order:", err.message);

    if(err.name === "ValidationError"){
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get all orders
router.get("/api/get_orders", async (req, res) => {
  try{
    const orders = await Order.find().sort({ time: -1 });
    res.json(orders);
  } 
  catch(err){
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
