import React, { useEffect, useState } from "react";
import {LineChart, Line, XAxis,YAxis, Tooltip,ResponsiveContainer,} from "recharts";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import Footer from "../components/Footer";
import { FiActivity } from "react-icons/fi";
import { FaBullseye, FaMedal } from "react-icons/fa";
import { io } from "socket.io-client";




// Portfolio Performance Data
const portfolioData = [
  { month: "Jan", value: 105000 },
  { month: "Feb", value: 107000 },
  { month: "Mar", value: 103000 },
  { month: "Apr", value: 110000 },
  { month: "May", value: 108500 },
  { month: "Jun", value: 115000 },
  { month: "Jul", value: 120000 },
];

// P&L (Profit & Loss) Data
const pnlData = [
  { time: "9:00", value: 0 },
  { time: "10:00", value: 1300 },
  { time: "11:00", value: -800 },
  { time: "12:00", value: 1800 },
  { time: "1:00", value: 1600 },
  { time: "2:00", value: 3100 },
  { time: "3:00", value: 2900 },
  { time: "4:00", value: 3500 },
];

// Recent Trades Data
const recentTrades = [
  { symbol: "AAPL", type: "BUY", qty: 50, price: 175.2, pnl: 420, time: "2 min ago" },
  { symbol: "TSLA", type: "SELL", qty: 25, price: 248.5, pnl: -180, time: "15 min ago" },
  { symbol: "BTC", type: "BUY", qty: 0.5, price: 43250, pnl: 1250, time: "1 hour ago" },
  { symbol: "NVDA", type: "SELL", qty: 30, price: 421.8, pnl: 890, time: "2 hours ago" },
];

// Top Movers Data
const movers = [
  { symbol: "AAPL", price: 175.2, change: 2.4, pnl: 4.12 },
  { symbol: "MSFT", price: 378.85, change: 1.8, pnl: 6.72 },
  { symbol: "GOOGL", price: 142.56, change: -0.9, pnl: -1.28 },
  { symbol: "AMZN", price: 151.94, change: 3.2, pnl: 4.71 },
];

const Dashboard = () => {
  // State for real-time Top Movers
  const [movers, setMovers] = useState([]);
  useEffect(() => {
    const socket = io("http://localhost:5000", { path: "/ws" });

    socket.on("connect", () => console.log("Connected to WebSocket:", socket.id));

    socket.on("marketUpdate", (data) => {
      setMovers(data); // update movers in real-time
    });

    // return () => socket.disconnect();

   
  socket.on("strategiesUpdate", (data) => {
      setStrategies(data);

      // Generate dynamic suggestions
      const suggestions = data.map((s) => {
        const roiValue = parseFloat(s.roi);
        const winRateValue = parseFloat(s.winRate);

        if (roiValue > 10) {
          return {
            text: `💡 ${s.name} (${s.symbol}) ROI is strong today: ${s.roi}. Consider reviewing!`,
            color: "text-green-400",
          };
        } else if (roiValue < 0) {
          return {
            text: `⚠️ ${s.name} (${s.symbol}) ROI is negative: ${s.roi}. Monitor closely.`,
            color: "text-red-400",
          };
        } else {
          return {
            text: `🔹 ${s.name} (${s.symbol}) ROI: ${s.roi}.`,
            color: "text-yellow-400",
          };
        }
      });

      setSmartSuggestions(suggestions.slice(0, 3)); // max 3 suggestions
    });

    return () => {
      socket.off("marketUpdate");
      socket.off("strategiesUpdate");
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0e0f1a] text-white">
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <nav className="flex justify-between items-center mb-6">
          <div className="text-xl font-semibold">Welcome back, Analyst!</div>
        </nav>
        {/* Smart Suggestions (Full Width Card) */}
        <Card className="bg-[#1c1f33] rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-2">🧠 Smart Suggestions</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {smartSuggestions.length > 0 ? (
            smartSuggestions.map((s, i) => (
              <li key={i} className={`${s.color}`}>
                {s.text}
              </li>
            ))
          ) : (
            <>
              <li className="text-blue-400">
                Review <span className="font-medium">XYZ Strategy</span> based on trades.
              </li>
              <li className="text-green-400">
                <span className="font-medium">AAPL</span> is strong today. Want to track?
              </li>
              <li className="text-yellow-300">3 trades away from your monthly goal!</li>
            </>
          )}
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
              <h1 className="text-4xl font-bold">1,25,000</h1>
              <p className="text-green-300 text-sm mt-3">▲ +5.2% from last month</p>
            </CardContent>
          </Card>

          {/* PnL */}
          <Card className="bg-gradient-to-r from-green-900 to-green-700">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <FiActivity className="text-blue-400 mr-2" />
                  Total's P&L
                </div>
                <h1 className="text-3xl font-bold">+₹3,500</h1>
              </div>
              <p className="text-green-300 text-sm">+2.8% daily return</p>
            </CardContent>
          </Card>

          {/* Active Positions */}
          <Card className="bg-gradient-to-r from-green-900 to-green-700">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <FaBullseye className="text-purple-400 mr-2" />
                  Active Positions
                </div>
                <h1 className="text-3xl font-bold">12</h1>
              </div>
              <p className="text-green-300 text-sm">8 profitable, 4 at loss</p>
            </CardContent>
          </Card>

          {/* Rank */}
          <Card className="bg-gradient-to-r from-green-800 to-green-600">
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <FaMedal className="text-orange-400 mr-2" />
                  Rank
                </div>
                <h1 className="text-3xl font-bold">#247</h1>
              </div>
              <p className="text-green-300 text-sm">▲ 112 positions this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
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

        {/* Recent Trades and Top Movers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Recent Trades */}
          <Card className="bg-gradient-to-br from-[#1e213a] to-[#161829] border border-white/10 shadow-xl rounded-2xl overflow-hidden">
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  📑 Recent Trades
                </h3>
                <a href="#" className="text-blue-400 text-sm hover:underline">
                  View All
                </a>
              </div>
          
              <div className="space-y-3">
                {recentTrades.map((trade, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-3 py-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
                  >
                    <span className="text-gray-300 text-sm">
                      <span className="font-medium text-white">{trade.symbol}</span>  
                      <span className="ml-1 text-xs text-gray-400">
                        ({trade.type} {trade.qty} @ {trade.price})
                      </span>
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        trade.pnl >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
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
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  🚀 Top Movers
                </h3>
                <a href="#" className="text-blue-400 text-sm hover:underline">
                  View Market
                </a>
              </div>
          
              <div className="space-y-3">
                {movers.map((stock, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center px-3 py-4 rounded-lg bg-white/5 hover:bg-white/10 transition"
                  >
                    <span className="text-gray-300 text-sm">
                      <span className="font-medium text-white">{stock.symbol}</span>  
                      <span className="ml-1 text-xs text-gray-400">(${stock.price})</span>
                    </span>
                    <span
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        stock.change >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {stock.change >= 0 ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <ArrowDownRight size={16} />
                      )}
                      {stock.change}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

      </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4  border-[#161829] p-10 bg-[#0a1128] rounded-lg">
            {["📈 Trade Now", "📊 Strategies", "👨‍🏫 Find Mentors", "🏆 Leaderboard"].map((label, i) => (
              <Card
                key={i}
                className="relative bg-gradient-to-r from-green-900 to-green-700 rounded-xl p-8
                           before:absolute before:top-0 before:left-0 before:h-full before:w-2
                           before:rounded-l-xl before:bg-gradient-to-b before:from-indigo-500 before:via-purple-700 before:to-indigo-500
                           before:shadow-[0_0_15px_5px_rgba(99,102,241,0.7)]
                           hover:before:shadow-[0_0_25px_8px_rgba(99,102,241,0.9)]
                           transition-all duration-300 ease-in-out "
              >
                <div className="flex items-center justify-center h-full">
                  <Button
                    className="bg-transparent text-2xl text-white hover:text-green-400 transition-colors duration-300">
                    {label}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

      </main>
    </div>
  );
};

export default Dashboard;
