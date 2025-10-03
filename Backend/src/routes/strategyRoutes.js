const express = require("express");
const axios = require("axios");
const { getStrategies, addStrategy, toggleStrategyStatus } = require("../store/strategyStore");



const router = express.Router();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Helper to fetch live price from Finnhub
async function fetchPrice(symbol) {
  try {
    if (symbol === "BTC") {
      // Dummy crypto price, replace with CoinGecko or real API if needed
      return (Math.random() * 40000 + 10000).toFixed(2);
    }
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );
    if (response.data && response.data.c) {
      return response.data.c;
    }
    return null;
  } catch (error) {
    console.error("Error fetching price for", symbol, error.message);
    return null;
  }
}

// GET all strategies with live price
router.get("/", async (req, res) => {
  const strategies = getStrategies();
  // Fetch live prices and merge
  const updatedStrategies = await Promise.all(
    strategies.map(async (s) => {
      const livePrice = await fetchPrice(s.symbol);
      return { ...s, price: livePrice !== null ? livePrice : s.price };
    })
  );
  res.json(updatedStrategies);
});

// POST create a new strategy
router.post("/", (req, res) => {
  const newStrategy = {
    ...req.body,
    status: "Active",
    roi: "0%",
    winRate: "0%",
    trades: 0,
    maxDD: "0%",
    price: "0",
  };
  const added = addStrategy(newStrategy);
  res.status(201).json(added);
});

// POST toggle strategy status
router.post("/toggle/:symbol", (req, res) => {
  const toggled = toggleStrategyStatus(req.params.symbol);
  if (!toggled) {
    return res.status(404).json({ error: "Strategy not found" });
  }
  res.json(toggled);
});

module.exports = router;
