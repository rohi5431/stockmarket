const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

// In-memory strategies (replace with DB later if needed)
let strategies = [
  { name: "RSI Momentum", symbol: "AAPL", status: "Active", roi: 25, winRate: 68, trades: 45, maxDD: -8, buy: "RSI < 30", sell: "RSI > 70", price: 0 },
  { name: "MA Crossover", symbol: "SPY", status: "Active", roi: 18, winRate: 72, trades: 23, maxDD: -12, buy: "50 MA > 200 MA", sell: "50 MA < 200 MA", price: 0 },
  { name: "Crypto Volatility", symbol: "BTC", status: "Paused", roi: 35, winRate: 61, trades: 67, maxDD: -22, buy: "Price touches lower BB", sell: "Price touches upper BB", price: 0 },
];

// Get all strategies
const getStrategies = (req, res) => res.json(strategies);

// Create a new strategy
const createStrategy = (req, res) => {
  const newStrategy = { ...req.body, price: 0 };
  strategies.push(newStrategy);
  res.json(newStrategy);
};

// Toggle strategy status
const toggleStrategy = (req, res) => {
  const s = strategies.find((st) => st.symbol === req.params.symbol);
  if(s){
    s.status = s.status === "Active" ? "Paused" : "Active";
    res.json(s);
  } 
  else{
    res.status(404).json({ error: "Strategy not found" });
  }
};

// Fetch live prices from Finnhub
const fetchPrices = async () => {
  for(let s of strategies){
    try{
      if(s.symbol === "BTC"){
        // Dummy crypto price, replace with CoinGecko API if needed
        s.price = (Math.random() * 40000 + 10000).toFixed(2);
      } 
      else{
        const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${s.symbol}&token=${FINNHUB_API_KEY}`);
        s.price = response.data.c;
      }
    } 
    catch(err){
      console.error(`Error fetching price for ${s.symbol}:`, err.message);
    }
  }
  return strategies;
};

// Export all functions
module.exports = {
  getStrategies,
  createStrategy,
  toggleStrategy,
  fetchPrices,
};
