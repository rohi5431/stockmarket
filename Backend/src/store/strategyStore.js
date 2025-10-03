// strategyStore.js
const express = require("express");
let strategies = [
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
    price: "0",
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
    price: "0",
  },
];

module.exports = {
  getStrategies: () => strategies,
  addStrategy: (strategy) => {
    strategies.push(strategy);
    return strategy;
  },
  toggleStrategyStatus: (symbol) => {
    const strategy = strategies.find((s) => s.symbol === symbol.toUpperCase());
    if (!strategy) return null;
    strategy.status = strategy.status === "Active" ? "Paused" : "Active";
    return strategy;
  },
};
