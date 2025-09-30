import React, { useState, useEffect } from "react";
import { Plus, Play, Pause, RefreshCcw } from "lucide-react";
import { io } from "socket.io-client";

const strategies = [
  {
    name: "RSI Momentum",
    type: "Technical",
    symbol: "AAPL",
    status: "Active",
    roi: "+24.8%",
    winRate: "68.5%",
    trades: 45,
    maxDD: "-8.7%",
    buy: "RSI < 30 AND Volume > Avg Volume",
    sell: "RSI > 70 OR Stop Loss -5%",
  },
  {
    name: "Moving Average Crossover",
    type: "Technical",
    symbol: "SPY",
    status: "Active",
    roi: "+18.3%",
    winRate: "72.1%",
    trades: 23,
    maxDD: "-12.3%",
    buy: "50-day MA crosses above 200-day MA",
    sell: "50-day MA crosses below 200-day MA OR Stop Loss -8%",
  },
  {
    name: "Crypto Volatility",
    type: "Crypto",
    symbol: "BTC",
    status: "Paused",
    roi: "+35.7%",
    winRate: "61.2%",
    trades: 67,
    maxDD: "-22.1%",
    buy: "Price touches lower Bollinger Band AND Volume > 2x Avg",
    sell: "Price touches upper Bollinger Band OR Stop Loss -10%",
  },
  {
    name: "Earnings Momentum",
    type: "Fundamental",
    symbol: "NVDA",
    status: "Active",
    roi: "+28.9%",
    winRate: "75.4%",
    trades: 18,
    maxDD: "-15.6%",
    buy: "Earnings beat > 10% AND Analyst upgrades > 2",
    sell: "Hold for 30 days OR Stop Loss -12%",
  },
];

const socket = io("http://localhost:5000", { path: "/ws" });

const Strategies = () => {
  // const [showModal, setShowModal] = useState(false);
   const [strategies, setStrategies] = useState([]);

  useEffect(() => {
    // Fetch initial strategies
    fetch("http://localhost:5000/api/strategies")
      .then((res) => res.json())
      .then((data) => setStrategies(data));

    // Listen for real-time updates
    socket.on("strategiesUpdate", (data) => setStrategies(data));

    return () => socket.off("strategiesUpdate");
  }, []);

  // Calculate top stats dynamically
  const totalStrategies = strategies.length;
  const activeStrategies = strategies.filter((s) => s.status === "Active").length;
  const avgROI = strategies.length
    ? "+" + (strategies.reduce((acc, s) => acc + s.roi, 0) / strategies.length).toFixed(1) + "%"
    : "0%";
  const avgWinRate = strategies.length
    ? (strategies.reduce((acc, s) => acc + s.winRate, 0) / strategies.length).toFixed(1) + "%"
    : "0%";
  const totalTrades = strategies.reduce((acc, s) => acc + s.trades, 0);

  return (
    <>
      <StrategiesHeader onCreate={() => alert("Open create modal")} />

      <div className="p-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Strategies" value={totalStrategies} subtitle={`${activeStrategies} active`} />
          <StatCard title="Avg ROI" value={avgROI} subtitle="Across strategies" />
          <StatCard title="Avg Win Rate" value={avgWinRate} subtitle="Success rate" />
          <StatCard title="Total Trades" value={totalTrades} subtitle="Executed trades" />
        </div>

        {/* Strategies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {strategies.map((s, i) => (
            <StrategyCard key={i} strategy={s} />
          ))}
        </div>
      </div>
    </>
  );
};

const StrategiesHeader = ({ onCreate }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {/* Left Section */}
      <div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          Trading Strategies
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Build, backtest, and optimize your trading strategies
        </p>
      </div>

      {/* Right Section (Button) */}
      <button
        onClick={onCreate}
        className="flex items-center gap-2 px-5 py-2.5 
                   rounded-xl shadow-md font-medium
                   bg-gradient-to-r from-emerald-500 to-green-600 
                   text-white hover:from-emerald-600 hover:to-green-700 
                   transition"
      >
        <Plus className="w-5 h-5" />
        Create Strategy
      </button>
    </div>
  );
}
function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/30">
      <p className="text-sm text-gray-200">{title}</p>
      <h2 className="text-2xl font-bold text-white">{value}</h2>
      <p className="text-xs text-gray-300">{subtitle}</p>
    </div>
  );
}

function StrategyCard({ strategy }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-white">{strategy.name}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            strategy.status === "Active"
              ? "bg-green-500/20 text-green-300"
              : "bg-yellow-500/20 text-yellow-300"
          }`}
        >
          {strategy.status}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <Metric label="ROI" value={strategy.roi} color="text-green-400" />
        <Metric label="Win Rate" value={strategy.winRate} color="text-blue-400" />
        <Metric label="Trades" value={strategy.trades} color="text-gray-200" />
        <Metric label="Max DD" value={strategy.maxDD} color="text-red-400" />
      </div>

      {/* Conditions */}
      <div className="bg-black/20 rounded-xl p-3 text-xs text-gray-200 space-y-1">
        <p><span className="text-green-400 font-semibold">Buy:</span> {strategy.buy}</p>
        <p><span className="text-red-400 font-semibold">Sell:</span> {strategy.sell}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition">
          <RefreshCcw className="w-4 h-4" /> Backtest
        </button>
        {strategy.status === "Active" ? (
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30 transition">
            <Pause className="w-4 h-4" /> Pause
          </button>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-300 hover:bg-green-500/30 transition">
            <Play className="w-4 h-4" /> Activate
          </button>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div>
      <p className="text-gray-300 text-xs">{label}</p>
      <p className={`font-semibold ${color}`}>{value}</p>
    </div>
  );
}

function CreateStrategyModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl w-[400px] border border-white/20">
        <h2 className="text-xl font-bold text-white mb-4">Create New Strategy</h2>

        <form className="space-y-3">
          <input
            type="text"
            placeholder="Strategy Name"
            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none"
          />
          <textarea
            placeholder="Description"
            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none"
          />
          <div className="flex gap-2">
            <select className="w-1/2 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white">
              <option>Type</option>
              <option>Technical</option>
              <option>Crypto</option>
              <option>Fundamental</option>
            </select>
            <input
              type="text"
              placeholder="Symbol (e.g. AAPL)"
              className="w-1/2 px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
            />
          </div>
          <input
            type="text"
            placeholder="Buy Condition"
            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
          />
          <input
            type="text"
            placeholder="Sell Condition"
            className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300"
          />
          <select className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white">
            <option>Risk Level</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-red-500/30 text-red-200 hover:bg-red-500/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-green-500/30 text-green-200 hover:bg-green-500/40"
            >
              Create Strategy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default Strategies;