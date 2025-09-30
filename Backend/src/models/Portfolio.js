const axios = require("axios");
require("dotenv").config();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// Example Holdings
let holdings = [
  { symbol: "AAPL", quantity: 10, avgPrice: 150 },
  { symbol: "TSLA", quantity: 5, avgPrice: 700 },
  { symbol: "MSFT", quantity: 8, avgPrice: 280 },
];

// Example Trades
let trades = [
  { id: 1, symbol: "AAPL", type: "BUY", qty: 10, price: 150, date: "2025-09-01", pnl: 0 },
  { id: 2, symbol: "TSLA", type: "BUY", qty: 5, price: 700, date: "2025-09-05", pnl: 0 },
  { id: 3, symbol: "MSFT", type: "BUY", qty: 8, price: 280, date: "2025-09-10", pnl: 0 },
];

// Get Holdings
const getHoldings = (req, res) => {
  res.json(holdings);
};

// Get Real-Time Quote
const getQuote = async (req, res) => {
  const { symbol } = req.params;
  try{
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    const response = await axios.get(url);
    const data = response.data;
    res.json({
      symbol,
      current: data.c,
      open: data.o,
      high: data.h,
      low: data.l,
    });
  } 
  catch(error){
    console.error("Error fetching quote:", error.message);
    res.status(500).json({ error: "Failed to fetch stock price" });
  }
};

// Get Trades
const getTrades = (req, res) => {
  res.json(trades);
};

module.exports = { getHoldings, getQuote, getTrades, trades, holdings };
