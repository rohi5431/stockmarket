import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../components/ui/Card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { FiActivity } from "react-icons/fi";
import { FaBullseye, FaMedal } from "react-icons/fa";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [pnlData, setPnlData] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [movers, setMovers] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000", { path: "/ws" });
    socket.on("connect", () => console.log("Connected:", socket.id));
    socket.on("portfolioUpdate", data => setPortfolioData(data));
    socket.on("pnlUpdate", data => setPnlData(data));
    socket.on("tradesUpdate", data => setRecentTrades(data));
    socket.on("marketUpdate", data => setMovers(data));
    return () => socket.disconnect();
  }, []);

  const latestPortfolio = portfolioData.length > 0 ? portfolioData[portfolioData.length - 1].value : 0;
  const previousPortfolio = portfolioData.length > 1 ? portfolioData[portfolioData.length - 2].value : latestPortfolio;
  const latestPnL = pnlData.length > 0 ? pnlData[pnlData.length - 1].value : 0;
  const previousPnL = pnlData.length > 1 ? pnlData[pnlData.length - 2].value : latestPnL;
  const profitableTrades = recentTrades.filter(t => t.pnl >= 0).length;
  const lossTrades = recentTrades.filter(t => t.pnl < 0).length;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <main className="flex-1 p-6 overflow-y-auto">

        {/* Header */}
        <nav className="flex justify-between items-center mb-6">
          <div className="text-2xl md:text-3xl font-semibold text-indigo-800">Welcome back, Analyst!</div>
        </nav>

        {/* Smart Suggestions */}
        <Card className="bg-indigo-50 shadow-md rounded-xl p-6 mb-6 border border-indigo-200">
          <h2 className="text-lg font-semibold text-indigo-900 mb-2">🧠 Smart Suggestions</h2>
          <ul className="list-disc pl-5 text-sm text-indigo-700 space-y-1">
            <li>Review <span className="text-indigo-500">XYZ Strategy</span> based on trades.</li>
            <li><span className="text-green-500">AAPL</span> is strong today. Want to track?</li>
            <li>3 trades away from your monthly goal!</li>
          </ul>
          <button className="mt-4 bg-indigo-500 px-4 py-2 rounded-md text-white text-sm shadow hover:bg-indigo-600 transition">
            View Full Analysis
          </button>
        </Card>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-6">
          <Card className="bg-green-50 border border-green-200 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between mb-2 text-green-800">
                <p>Total Balance</p>
                <span>₹</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-green-900">{latestPortfolio.toLocaleString()}</h1>
              <p className="text-green-500 text-sm mt-2">
                ▲ {(((latestPortfolio - previousPortfolio) / previousPortfolio) * 100).toFixed(2)}% from last update
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border border-blue-200 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center text-blue-700">
                  <FiActivity className="text-blue-400 mr-2" /> Total's P&L
                </div>
                <h1 className="text-3xl font-bold text-blue-900">₹{latestPnL.toLocaleString()}</h1>
              </div>
              <p className="text-blue-500 text-sm">
                {(((latestPnL - previousPnL) / (previousPnL || 1)) * 100).toFixed(2)}% change
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border border-purple-200 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center text-purple-700">
                  <FaBullseye className="text-purple-400 mr-2" /> Active Positions
                </div>
                <h1 className="text-3xl font-bold text-purple-900">{recentTrades.length}</h1>
              </div>
              <p className="text-purple-500 text-sm">{profitableTrades} profitable, {lossTrades} at loss</p>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border border-yellow-200 shadow-sm rounded-xl">
            <CardContent className="p-6">
              <div className="flex justify-between mb-2">
                <div className="flex items-center text-yellow-700">
                  <FaMedal className="text-yellow-500 mr-2" /> Rank
                </div>
                <h1 className="text-3xl font-bold text-yellow-900">#247</h1>
              </div>
              <p className="text-yellow-500 text-sm">▲ 112 positions this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-pink-50 border border-pink-200 shadow-sm rounded-xl">
            <CardContent>
              <h3 className="mb-2 text-pink-900 font-semibold">Portfolio Performance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={portfolioData}>
                  <XAxis dataKey="month" stroke="#9d174d" />
                  <YAxis stroke="#9d174d" />
                  <Tooltip contentStyle={{ backgroundColor: "#fce7f3", border: "1px solid #f9a8d4", color: "#6b21a8" }} />
                  <Line type="monotone" dataKey="value" stroke="#db2777" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-cyan-50 border border-cyan-200 shadow-sm rounded-xl">
            <CardContent>
              <h3 className="mb-2 text-cyan-900 font-semibold">Today's P&L</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={pnlData}>
                  <XAxis dataKey="time" stroke="#0369a1" />
                  <YAxis stroke="#0369a1" />
                  <Tooltip contentStyle={{ backgroundColor: "#cffafe", border: "1px solid #38bdf8", color: "#0369a1" }} />
                  <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trades & Top Movers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-orange-50 border border-orange-200 shadow-sm rounded-xl overflow-hidden">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-orange-900 flex items-center gap-2">📑 Recent Trades</h3>
                <a href="#" className="text-orange-500 text-sm hover:underline">View All</a>
              </div>
              <div className="space-y-2">
                {recentTrades.map((trade, i) => (
                  <div key={i} className="flex justify-between items-center px-3 py-3 rounded-lg bg-orange-100 hover:bg-orange-200 transition">
                    <span className="text-orange-700 text-sm">
                      <span className="font-medium text-orange-900">{trade.symbol}</span>
                      <span className="ml-1 text-xs text-orange-500">({trade.type} {trade.qty} @ {trade.price})</span>
                    </span>
                    <span className={`text-sm font-semibold ${trade.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {trade.pnl >= 0 ? `+₹${trade.pnl}` : `-₹${Math.abs(trade.pnl)}`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-lime-50 border border-lime-200 shadow-sm rounded-xl overflow-hidden">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-lime-900 flex items-center gap-2">🚀 Top Movers</h3>
                <a href="#" className="text-lime-500 text-sm hover:underline">View Market</a>
              </div>
              <div className="space-y-2">
                {movers.map((stock, i) => (
                  <div key={i} className="flex justify-between items-center px-3 py-3 rounded-lg bg-lime-100 hover:bg-lime-200 transition">
                    <span className="text-lime-700 text-sm">
                      <span className="font-medium text-lime-900">{stock.symbol}</span>
                      <span className="ml-1 text-xs text-lime-500">(${stock.price})</span>
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-semibold ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {stock.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {stock.change}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
