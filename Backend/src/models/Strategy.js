const axios = require("axios");
require("dotenv").config();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// In-memory strategies
let strategies = [
  {
    name: "RSI Momentum",
    type: "Stock",
    symbol: "AAPL",
    status: "Active",
    roi: 24.8,
    winRate: 68.5,
    trades: 45,
    maxDD: -12.3,
    buy: "RSI < 30",
    sell: "RSI > 70",
    price: 0,
    return: 1200,
    followers: 100
  },
  {
    name: "MACD Crossover",
    type: "Stock",
    symbol: "TSLA",
    status: "Paused",
    roi: 18.2,
    winRate: 62.3,
    trades: 38,
    maxDD: -15.8,
    buy: "MACD > Signal",
    sell: "MACD < Signal",
    price: 0,
    return: 2100,
    followers: 150
  },
  {
    name: "Crypto Volatility",
    type: "Crypto",
    symbol: "BTC",
    status: "Active",
    roi: 35.4,
    winRate: 65.2,
    trades: 50,
    maxDD: -18.5,
    buy: "Touches lower BB",
    sell: "Touches upper BB",
    price: 0,
    return: 1800,
    followers: 90
  }
];

// === Functions ===

function getStrategies() {
  return strategies;
}

function addStrategy(strategy) {
  strategies.push(strategy);
}

function toggleStrategyStatus(symbol) {
  const strategy = strategies.find((s) => s.symbol === symbol);
  if (!strategy) return null;
  strategy.status = strategy.status === "Active" ? "Paused" : "Active";
  return strategy;
}

async function updatePrices() {
  for (let s of strategies) {
    try {
      if (s.type === "Crypto") {
        // Dummy crypto price (replace with CoinGecko or other APIs)
        s.price = (Math.random() * 30000 + 10000).toFixed(2);
      } else {
        const url = `https://finnhub.io/api/v1/quote?symbol=${s.symbol}&token=${FINNHUB_API_KEY}`;
        const res = await axios.get(url);
        s.price = res.data.c || 0;
      }
    } catch (err) {
      console.error(`❌ Error fetching price for ${s.symbol}:`, err.message);
    }
  }
  return strategies;
}

module.exports = {
  getStrategies,
  addStrategy,
  toggleStrategyStatus,
  updatePrices,
};
