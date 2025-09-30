// routes/market.js
const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

const FINNHUB_API = "https://finnhub.io/api/v1";
const API_KEY = process.env.FINNHUB_API_KEY;

// Real-time quote
router.get("/quote/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  try{
    const response = await axios.get(`${FINNHUB_API}/quote`, {
      params: { symbol, token: API_KEY },
    });
    res.json({ c: response.data.c, pc: response.data.pc });
  } 
  catch(err){
    console.error(`Quote fetch error for ${symbol}:`, err.message);
    res.status(404).json({ error: "Symbol not found or API error" });
  }
});

// Search symbols
router.get("/search/:query", async (req, res) => {
  try {
    const response = await axios.get(`${FINNHUB_API}/search`, {
      params: { q: req.params.query, token: API_KEY },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
