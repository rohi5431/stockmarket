import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { FiActivity } from "react-icons/fi";
import { FaBullseye, FaMedal } from "react-icons/fa";
import { io } from "socket.io-client";

const Dashboard = () => {
  // ===== Live States =====
  const [portfolioData, setPortfolioData] = useState([]);
  const [pnlData, setPnlData] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [movers, setMovers] = useState([]);

  // ===== Connect to Socket.IO =====
  useEffect(() =>{
    const socket = io("http://localhost:5000", { path: "/ws" });
  
    socket.on("connect", () => console.log("Connected:", socket.id));

    // Receive updates from backend
    socket.on("portfolioUpdate", data => setPortfolioData(data));
    socket.on("pnlUpdate", data => setPnlData(data));
    socket.on("tradesUpdate", data => setRecentTrades(data));
    socket.on("marketUpdate", data => setMovers(data));

    return () => socket.disconnect();
  }, []);

  // ===== Helper Functions =====
  const latestPortfolio = portfolioData.length > 0 ? portfolioData[portfolioData.length - 1].value : 0;
  const previousPortfolio = portfolioData.length > 1 ? portfolioData[portfolioData.length - 2].value : latestPortfolio;

  const latestPnL = pnlData.length > 0 ? pnlData[pnlData.length - 1].value : 0;
  const previousPnL = pnlData.length > 1 ? pnlData[pnlData.length - 2].value : latestPnL;

  const profitableTrades = recentTrades.filter(t => t.pnl >= 0).length;
  const lossTrades = recentTrades.filter(t => t.pnl < 0).length;

  return (
    <div className="flex min-h-screen dark:bg-crimson text-white">
      <main className="flex-1 p-6 overflow-y-auto">

        <nav className="flex justify-between items-center mb-6">
          <div className="text-[30px] font-semibold text-white">Welcome back, Analyst!</div>
        </nav>

        {/* Smart Suggestions */}
        <Card className="bg-[#1c1f33] rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">🧠 Smart Suggestions</h2>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
            <li>Review <span className="text-blue-400">XYZ Strategy</span> based on trades.</li>
            <li><span className="text-green-400">AAPL</span> is strong today. Want to track?</li>
            <li>3 trades away from your monthly goal!</li>
          </ul>
          <button className="mt-4 bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 rounded-md text-white text-sm hover:from-green-500 hover:to-blue-600">
            View Full Analysis
          </button>
        </Card>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-6">
          {/* Total Balance */}
          <Card className="bg-gradient-to-r from-green-900 to-green-700">
            <CardContent className="p-6">
              <div className="flex justify-between mb-2">
                <p>Total Balance</p>
                <span>₹</span>
              </div>
              <h1 className="text-4xl font-bold">{latestPortfolio.toLocaleString()}</h1>
              <p className="text-green-300 text-sm mt-3">
                ▲ {(((latestPortfolio - previousPortfolio) / previousPortfolio) * 100).toFixed(2)}% from last update
              </p>
            </CardContent>
          </Card>

          {/* Total PnL */}
          <Card className="bg-gradient-to-r from-green-900 to-green-700">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <FiActivity className="text-blue-400 mr-2" /> Total's P&L
                </div>
                <h1 className="text-3xl font-bold">₹{latestPnL.toLocaleString()}</h1>
              </div>
              <p className="text-green-300 text-sm">
                {(((latestPnL - previousPnL) / (previousPnL || 1)) * 100).toFixed(2)}% change
              </p>
            </CardContent>
          </Card>

          {/* Active Positions */}
          <Card className="bg-gradient-to-r from-green-900 to-green-700">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <FaBullseye className="text-purple-400 mr-2" /> Active Positions
                </div>
                <h1 className="text-3xl font-bold">{recentTrades.length}</h1>
              </div>
              <p className="text-green-300 text-sm">{profitableTrades} profitable, {lossTrades} at loss</p>
            </CardContent>
          </Card>

          {/* Rank */}
          <Card className="bg-gradient-to-r from-green-800 to-green-600">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <FaMedal className="text-orange-400 mr-2" /> Rank
                </div>
                <h1 className="text-3xl font-bold">#247</h1>
              </div>
              <p className="text-green-300 text-sm">▲ 112 positions this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent>
              <h3 className="mb-2">Portfolio Performance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={portfolioData}>
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#00ff99" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-[#161829]">
            <CardContent>
              <h3 className="mb-2">Today's P&L</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={pnlData}>
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3399ff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-[#1e213a] to-[#161829] border border-white/10 shadow-xl rounded-2xl overflow-hidden">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">📑 Recent Trades</h3>
                <a href="#" className="text-blue-400 text-sm hover:underline">View All</a>
              </div>
              <div className="space-y-3">
                {recentTrades.map((trade, i) => (
                  <div key={i} className="flex justify-between items-center px-3 py-4 rounded-lg bg-white/5 hover:bg-white/10 transition">
                    <span className="text-gray-300 text-sm">
                      <span className="font-medium text-white">{trade.symbol}</span>
                      <span className="ml-1 text-xs text-gray-400">({trade.type} {trade.qty} @ {trade.price})</span>
                    </span>
                    <span className={`text-sm font-semibold ${trade.pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {trade.pnl >= 0 ? `+₹${trade.pnl}` : `-₹${Math.abs(trade.pnl)}`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Movers */}
          <Card className="bg-gradient-to-br from-[#1a1d35] to-[#161829] border border-white/10 shadow-xl rounded-2xl overflow-hidden">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">🚀 Top Movers</h3>
                <a href="#" className="text-blue-400 text-sm hover:underline">View Market</a>
              </div>
              <div className="space-y-3">
                {movers.map((stock, i) => (
                  <div key={i} className="flex justify-between items-center px-3 py-4 rounded-lg bg-white/5 hover:bg-white/10 transition">
                    <span className="text-gray-300 text-sm">
                      <span className="font-medium text-white">{stock.symbol}</span>
                      <span className="ml-1 text-xs text-gray-400">(${stock.price})</span>
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-semibold ${stock.change >= 0 ? "text-green-400" : "text-red-400"}`}>
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
