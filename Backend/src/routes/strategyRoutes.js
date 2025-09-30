import express from "express";

export const strategies = [
  {
    name: "RSI Momentum",
    type: "Stock",
    symbol: "AAPL",
    status: "Active",
    roi: "+24.8%",
    winRate: "68.5%",
    trades: 45,
    maxDD: "-12.3%",
    buy: "RSI < 30",
    sell: "RSI > 70",
    price: "0"
  },
  {
    name: "MACD Crossover",
    type: "Stock",
    symbol: "TSLA",
    status: "Paused",
    roi: "+18.2%",
    winRate: "62.3%",
    trades: 38,
    maxDD: "-15.8%",
    buy: "MACD > Signal",
    sell: "MACD < Signal",
    price: "0"
  }
];

const router = express.Router();

router.get("/api/strategies", (req, res) => res.json(strategies));

router.post("/api/strategies", (req, res) => {
  const strategy = {
    ...req.body,
    status: "Active",
    roi: "0%",
    winRate: "0%",
    trades: 0,
    maxDD: "0%",
    price: "0"
  };
  strategies.push(strategy);
  res.json(strategy);
});

router.post("/toggle/:symbol", (req, res) => {
  const s = strategies.find((x) => x.symbol === req.params.symbol);
  if(s){
    s.status = s.status === "Active" ? "Paused" : "Active";
    res.json(s);
  } 
  else{
    res.status(404).json({ error: "Not found" });
  }
});

export default router;

