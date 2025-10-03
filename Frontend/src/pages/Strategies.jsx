import React, { useState, useEffect } from "react";
import { Plus, Play, Pause, RefreshCcw } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { socket } from "../services/socket";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Strategies = () => {
  const [strategies, setStrategies] = useState([]);
  const [priceHistory, setPriceHistory] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:7000/api/strategies")
      .then((res) => res.json())
      .then((data) => setStrategies(data))
      .catch(console.error);

    socket.on("strategiesUpdate", (data) => {
      setStrategies(data);
      setPriceHistory((prev) => {
        const updated = { ...prev };
        data.forEach((s) => {
          if (!updated[s.symbol]) updated[s.symbol] = [];
          updated[s.symbol] = [...updated[s.symbol], Number(s.price)].slice(-20);
        });
        return updated;
      });
    });

    return () => socket.disconnect();
  }, []);

  const toggleStatus = (symbol) => {
    fetch(`http://localhost:7000/api/strategies/toggle/${symbol}`, { method: "POST" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <StrategiesHeader onCreate={() => setShowModal(true)} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Strategies" value={strategies.length} subtitle="Active Strategies" color="blue" />
        <StatCard title="Avg ROI" value="~25%" subtitle="Across strategies" color="emerald" />
        <StatCard title="Avg Win Rate" value="70%" subtitle="Success rate" color="indigo" />
        <StatCard title="Total Trades" value={153} subtitle="Executed trades" color="amber" />
      </div>

      {/* Strategy List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((s, i) => (
          <StrategyCard
            key={i}
            strategy={s}
            toggleStatus={toggleStatus}
            priceHistory={priceHistory[s.symbol] || []}
          />
        ))}
      </div>

      {showModal && <CreateStrategyModal onClose={() => setShowModal(false)} setStrategies={setStrategies} />}
    </div>
  );
};

// ----------- COMPONENTS ----------- //

const StrategiesHeader = ({ onCreate }) => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
        Trading Strategies
      </h1>
      <p className="text-sm text-gray-500 mt-1">Build, backtest, and optimize</p>
    </div>
    <button
      onClick={onCreate}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl shadow-md font-medium bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition"
    >
      <Plus className="w-5 h-5" /> Create Strategy
    </button>
  </div>
);

function StatCard({ title, value, subtitle, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700"
  };

  return (
    <div className={`p-4 rounded-2xl shadow-md border ${colors[color]} hover:shadow-lg transition`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-xs">{subtitle}</p>
    </div>
  );
}

function StrategyCard({ strategy, toggleStatus, priceHistory }) {
  const data = {
    labels: priceHistory.map((_, i) => i + 1),
    datasets: [
      {
        label: strategy.symbol,
        data: priceHistory,
        borderColor: "rgba(34,197,94,0.8)",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { beginAtZero: false } }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-[1.02] transition">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800">{strategy.name}</h3>
        <span className="text-gray-600 text-sm">
          ${strategy.price ? Number(strategy.price).toFixed(2) : "-"}
        </span>
      </div>

      {priceHistory.length > 0 && <Line data={data} options={options} className="mb-3" />}

      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <Metric label="ROI" value={strategy.roi} color="text-emerald-600" />
        <Metric label="Win Rate" value={strategy.winRate} color="text-blue-600" />
        <Metric label="Trades" value={strategy.trades} color="text-amber-600" />
        <Metric label="Max DD" value={strategy.maxDD} color="text-red-600" />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-600 space-y-1">
        <p>
          <span className="text-emerald-600 font-semibold">Buy:</span> {strategy.buy}
        </p>
        <p>
          <span className="text-red-600 font-semibold">Sell:</span> {strategy.sell}
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
          <RefreshCcw className="w-4 h-4" /> Backtest
        </button>
        <button
          onClick={() => toggleStatus(strategy.symbol)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
            strategy.status === "Active"
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          }`}
        >
          {strategy.status === "Active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {strategy.status === "Active" ? "Pause" : "Activate"}
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value, color }) {
  return (
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className={`font-semibold ${color}`}>{value}</p>
    </div>
  );
}

// Modal for creating strategy
function CreateStrategyModal({ onClose, setStrategies }) {
  const [form, setForm] = useState({ name: "", symbol: "", buy: "", sell: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:7000/api/strategies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then((res) => res.json())
      .then((data) => setStrategies((prev) => [...prev, data]))
      .finally(() => onClose());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Strategy</h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
            placeholder="e.g., RSI Momentum"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 outline-none"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your strategy..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 outline-none resize-none"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 focus:ring-2 focus:ring-emerald-400 outline-none"
          >
            <option value="">Select Type</option>
            <option value="Momentum">Momentum</option>
            <option value="Mean Reversion">Mean Reversion</option>
            <option value="Breakout">Breakout</option>
          </select>

          <input
            name="symbol"
            value={form.symbol}
            onChange={handleChange}
            type="text"
            placeholder="e.g., AAPL"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 outline-none"
          />

          <input
            name="buy"
            value={form.buy}
            onChange={handleChange}
            type="text"
            placeholder="e.g., RSI < 30"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 outline-none"
          />

          <input
            name="sell"
            value={form.sell}
            onChange={handleChange}
            type="text"
            placeholder="e.g., RSI > 70"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-emerald-400 outline-none"
          />

          <select
            name="risk"
            value={form.risk}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-800 focus:ring-2 focus:ring-emerald-400 outline-none"
          >
            <option value="">Select Risk Level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition"
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
