import React from "react";
import { Card, CardContent } from "../components/ui/Card";
import { FiActivity } from "react-icons/fi";
import { FaBullseye } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi"; // Trending up icon for Day's Change
import { FiFilter } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import PortfolioOverview from "../components/PortfolioOverview";
import PortfolioDashboard from "../components/PortfolioDashboard";

const Portfolio = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-6 bg-[#0a0f1a] rounded-xl shadow-md">
      {/* Left: Title + Subtitle */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">📊 Portfolio Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Track your holdings and performance in real-time</p>
      </div>

      {/* Right: Buttons */}
      <div className="flex gap-3 mt-4 md:mt-0">
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1f2937] text-white text-sm rounded-lg border border-gray-600 hover:bg-[#2c3e50] transition">
          <FiFilter size={16} />
          Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg shadow hover:from-indigo-500 hover:to-purple-500 transition">
          <HiOutlineDownload size={18} />
          Export
        </button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-6">
      {/* Total Value */}
      <Card className="bg-[#0f1e16] border border-green-700 rounded-lg">
        <CardContent className="p-6">
          <div className="flex justify-between mb-2 text-green-500 text-sm font-semibold">
            <p>Total Value</p>
            <span>$</span>
          </div>
          <h1 className="text-4xl font-bold text-green-400">$49,251.5</h1>
          <p className="text-green-300 text-xs mt-2">Portfolio value</p>
        </CardContent>
      </Card>

      {/* Total P&L */}
      <Card className="bg-[#0f1e16] border border-green-700 rounded-lg">
        <CardContent className="p-6">
          <div className="flex justify-between mb-4 items-center">
            <div className="flex items-center text-green-500 font-semibold text-sm">
              <FiActivity className="text-green-400 mr-2" size={20} />
              Total's P&L
            </div>
            <h1 className="text-3xl font-bold text-green-400">+$774.50</h1>
          </div>
          <p className="text-green-300 text-xs">+1.60% overall return</p>
        </CardContent>
      </Card>

      {/* Holdings */}
      <Card className="bg-[#0f1e33] border border-blue-700 rounded-lg">
        <CardContent className="p-6">
          <div className="flex justify-between mb-4 items-center">
            <div className="flex items-center text-blue-500 font-semibold text-sm">
              <FaBullseye className="text-blue-400 mr-2" size={20} />
              Holdings
            </div>
            <h1 className="text-3xl font-bold text-blue-400">4</h1>
          </div>
          <p className="text-blue-300 text-xs">Active positions</p>
        </CardContent>
      </Card>

      {/* Day's Change */}
      <Card className="bg-[#2b174d] border border-purple-700 rounded-lg">
        <CardContent className="p-6">
          <div className="flex justify-between mb-4 items-center">
            <div className="flex items-center text-purple-500 font-semibold text-sm">
              <HiTrendingUp className="text-purple-400 mr-2" size={20} />
              Day's Change
            </div>
            <h1 className="text-3xl font-bold text-purple-400">+$3,500</h1>
          </div>
          <p className="text-purple-300 text-xs">+2.8% today</p>
        </CardContent>
      </Card>
    </div>
    <PortfolioOverview />
    <PortfolioDashboard />
    </>
  );
};

export default Portfolio;



import React from "react";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const holdings = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    qty: 50,
    avgPrice: 172.3,
    currentPrice: 175.2,
    pnl: 145.0,
    change: 1.68,
    value: 8760,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    qty: 25,
    avgPrice: 251.8,
    currentPrice: 248.5,
    pnl: -82.5,
    change: -1.31,
    value: 6212.5,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    qty: 0.5,
    avgPrice: 42000,
    currentPrice: 43250,
    pnl: 625,
    change: 2.98,
    value: 21625,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    qty: 30,
    avgPrice: 418.9,
    currentPrice: 421.8,
    pnl: 87,
    change: 0.69,
    value: 12654,
  },
];

const PortfolioOverview = () => {
  const data = {
    labels: holdings.map((h) => h.symbol),
    datasets: [
      {
        label: "Value",
        data: holdings.map((h) => h.value),
        backgroundColor: ["#1d4ed8", "#f97316", "#ef4444", "#10b981"],
        borderWidth: 2,
        borderColor: "#0f172a",
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#cbd5e1",
          font: { size: 14, weight: "600" },
        },
      },
    },
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 p-6 bg-[#0c1224] rounded-xl shadow-lg text-gray-300">
      {/* Holdings Table */}
      <div className="bg-[#10192a] p-6 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-xl font-bold text-white mb-6">📘 My Holdings</h2>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#162033] text-gray-300">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Symbol</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Avg Price</th>
              <th className="px-4 py-3">Current Price</th>
              <th className="px-4 py-3">P&L</th>
              <th className="px-4 py-3 rounded-tr-lg">Value</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-[#1b2a40] transition duration-150 ease-in-out"
              >
                <td className="px-4 py-3 font-bold text-white">
                  {item.symbol}
                  <div className="text-xs italic text-gray-500">{item.name}</div>
                </td>
                <td className="px-4 py-3">{item.qty}</td>
                <td className="px-4 py-3">${item.avgPrice.toFixed(2)}</td>
                <td className="px-4 py-3">${item.currentPrice.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.pnl >= 0
                        ? "bg-green-800 text-green-300"
                        : "bg-red-800 text-red-300"
                    }`}
                  >
                    {item.pnl >= 0 ? (
                      <HiTrendingUp className="mr-1" />
                    ) : (
                      <HiTrendingDown className="mr-1" />
                    )}
                    {item.pnl >= 0 ? "+" : "-"}${Math.abs(item.pnl).toFixed(2)} (
                    {item.change >= 0 ? "+" : "-"}
                    {Math.abs(item.change).toFixed(2)}%)
                  </div>
                </td>
                <td className="px-4 py-3 text-white font-semibold">
                  ${item.value.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Portfolio Allocation */}
      <div className="bg-[#10192a] p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-white mb-6">📈 Allocation Breakdown</h2>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default PortfolioOverview;   import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PortfolioDashboard = () => {
  // Sample data for the portfolio performance chart
  const data = {
    labels: [
      "Jan 1",
      "Jan 5",
      "Jan 10",
      "Jan 15",
      "Jan 20",
      "Jan 25",
      "Jan 30",
    ],
    datasets: [
      {
        label: "Portfolio Value",
        data: [105000, 107000, 103000, 130000, 128000, 135000, 132000],
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.2)", // Indigo-500 with opacity
        borderColor: "rgba(99, 102, 241, 1)", // Indigo-500
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "#2c3e50" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "#2c3e50" },
      },
    },
  };

  return (
    <>
    <div className="bg-[#0f121c] p-6 rounded-xl shadow-lg space-y-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Portfolio Performance */}
        <section className="flex-1 bg-gradient-to-br from-[#1e293b] to-[#0d1725] rounded-lg p-6 shadow-md">
          <h2 className="text-white text-xl font-semibold mb-4">
            Portfolio Performance
          </h2>
          <div className="w-full h-75">
            <Line data={data} options={options} />
          </div>
        </section>

        {/* Recent Trades */}
        <section className="w-full max-w-md bg-[#1f293b] rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-white text-xl font-semibold">Recent Trades</h2>
            <button className="text-indigo-400 text-sm hover:underline">
              View All
            </button>
          </div>

          <ul className="divide-y divide-gray-700 max-h-80 overflow-y-auto">
            {[
              {
                symbol: "AAPL",
                action: "BUY",
                quantity: 25,
                price: 175.2,
                amount: 4380,
                date: "2024-01-15",
                positive: true,
              },
              {
                symbol: "TSLA",
                action: "SELL",
                quantity: 10,
                price: 248.5,
                amount: 2485,
                date: "2024-01-15",
                positive: false,
              },
              {
                symbol: "BTC",
                action: "BUY",
                quantity: 0.25,
                price: 43250,
                amount: 10812.5,
                date: "2024-01-14",
                positive: true,
              },
              {
                symbol: "NVDA",
                action: "BUY",
                quantity: 15,
                price: 421.8,
                amount: 6327,
                date: "2024-01-14",
                positive: true,
              },
              {
                symbol: "AAPL",
                action: "BUY",
                quantity: 25,
                price: 169.4,
                amount: 4235,
                date: "2024-01-13",
                positive: true,
              },
            ].map((trade, i) => (
              <li
                key={i}
                className="flex justify-between items-center py-3 hover:bg-[#28354b] rounded-md px-2 transition"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`p-2 rounded-full ${
                      trade.positive
                        ? "bg-green-600 text-green-200"
                        : "bg-red-600 text-red-200"
                    }`}
                  >
                    {trade.positive ? (
                      <HiArrowSmUp size={20} />
                    ) : (
                      <HiArrowSmDown size={20} />
                    )}
                  </span>
                  <div>
                    <p className="text-white font-bold">{trade.symbol}</p>
                    <p className="text-gray-400 text-xs">
                      {trade.action} {trade.quantity} @ ${trade.price}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">
                    ${trade.amount.toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs">{trade.date}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Trade History Table */}
      <section className="bg-[#1b2233] rounded-lg p-6 shadow-inner">
        <h2 className="text-white text-xl font-semibold mb-6">Trade History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-300 text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {[
                  "Date & Time",
                  "Symbol",
                  "Type",
                  "Quantity",
                  "Price",
                  "Total",
                  "Status",
                ].map((header) => (
                  <th key={header} className="py-3 px-4 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  date: "2024-01-15 10:30 AM",
                  symbol: "AAPL",
                  type: "BUY",
                  quantity: 25,
                  price: 175.2,
                  total: 4380,
                  status: "Completed",
                },
                {
                  date: "2024-01-15 09:45 AM",
                  symbol: "TSLA",
                  type: "SELL",
                  quantity: 10,
                  price: 248.5,
                  total: 2485,
                  status: "Completed",
                },
                {
                  date: "2024-01-14 02:15 PM",
                  symbol: "BTC",
                  type: "BUY",
                  quantity: 0.25,
                  price: 43250,
                  total: 10812.5,
                  status: "Completed",
                },
                {
                  date: "2024-01-14 11:20 AM",
                  symbol: "NVDA",
                  type: "BUY",
                  quantity: 15,
                  price: 421.8,
                  total: 6327,
                  status: "Completed",
                },
                {
                  date: "2024-01-13 03:45 PM",
                  symbol: "AAPL",
                  type: "BUY",
                  quantity: 25,
                  price: 169.4,
                  total: 4235,
                  status: "Completed",
                },
              ].map((trade, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-700 hover:bg-[#28354b] transition"
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div>{trade.date.split(" ")[0]}</div>
                    <div className="text-xs text-gray-400">
                      {trade.date.split(" ").slice(1).join(" ")}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{trade.symbol}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        trade.type === "BUY"
                          ? "bg-gray-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">{trade.quantity}</td>
                  <td className="py-3 px-4">${trade.price.toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold">
                    ${trade.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-400 font-semibold px-3 py-1 border border-green-400 rounded-full text-xs">
                      {trade.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
    </>
  );
};

export default PortfolioDashboard;
    