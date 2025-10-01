import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { FiActivity, FiFilter } from "react-icons/fi";
import { FaBullseye } from "react-icons/fa";
import { HiTrendingUp, HiOutlineDownload } from "react-icons/hi";
import PortfolioOverview from "../components/PortfolioOverview";
import PortfolioDashboard from "../components/PortfolioDashboard";
import axios from "axios";
import ExportFile from "../components/ExportFile";  

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [prices, setPrices] = useState({});
  const [totalValue, setTotalValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  const [daysChange, setDaysChange] = useState(0);
  const [recentTrades, setRecentTrades] = useState([]);

  // Fetch holdings from API
  useEffect(() => {
    const fetchHoldings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/portfolio");
        setHoldings(res.data);
      } catch (err) {
        console.error("Failed to fetch holdings:", err);
      }
    };
    fetchHoldings();
  }, []);

  // Fetch prices for all holdings
  useEffect(() => {
    if(!holdings.length) return;

    const fetchPrices = async () => {
      const updatedPrices = {};
      for (let h of holdings){
        try{
          const res = await axios.get(`http://localhost:5000/api/quote/${h.symbol}`);
          updatedPrices[h.symbol] = res.data; // { current, open, high, low }
        } 
        catch(err){
          console.error(`Failed to fetch price for ${h.symbol}`, err);
        }
      }
      setPrices(updatedPrices);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, [holdings]);

  // Fetch recent trades
  useEffect(() => {
    const fetchTrades = async () => {
      try{
        const res = await axios.get("http://localhost:5000/api/trades");
        setRecentTrades(res.data);
      }
      catch(err){
        console.error("Failed to fetch trades:", err);
      }
    };
    fetchTrades();
  }, []);

  // Calculate total value, P&L, day's change
  useEffect(() => {
    let value = 0;
    let pnl = 0;
    let dayDiff = 0;

    holdings.forEach((h) => {
      const priceData = prices[h.symbol];
      if(priceData){
        const currentPrice = priceData.current;
        const change = currentPrice - h.avgPrice; // P&L
        const todayChange = currentPrice - priceData.open; // Day's change

        value += currentPrice * h.quantity;
        pnl += change * h.quantity;
        dayDiff += todayChange * h.quantity;
      }
    });

    setTotalValue(value);
    setTotalPnL(pnl);
    setDaysChange(dayDiff);
  }, [holdings, prices]);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-6 bg-gray-800 rounded-xl shadow-md">
        <div>
          <h1 className="text-3xl font-extrabold text-white">📊 Portfolio Overview</h1>
          <p className="text-gray-400 text-sm mt-1">Track your holdings and performance</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1f2937] text-white text-sm rounded-lg border border-gray-600 hover:bg-[#2c3e50] transition">
            <FiFilter size={16} />
            Filter
          </button>
          {/* <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm rounded-lg shadow hover:from-indigo-500 hover:to-purple-500 transition">
            <HiOutlineDownload size={18} />
            Export
          </button> */}
          <ExportFile holdings={holdings} trades={recentTrades} />

        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-6">
        {/* Total Value */}
        <Card className="bg-[#0f1e16] border border-green-700 rounded-lg">
          <CardContent className="p-6">
            <div className="flex justify-between mb-2 text-green-500 text-sm font-semibold">
              <p>Total Value</p>
              <span>$</span>
            </div>
            <h1 className="text-4xl font-bold text-green-400">${totalValue.toFixed(2)}</h1>
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
              <h1 className="text-3xl font-bold text-green-400">
                {totalPnL >= 0 ? "+" : "-"}${Math.abs(totalPnL).toFixed(2)}
              </h1>
            </div>
            <p className="text-green-300 text-xs">
              {totalValue > 0 ? ((totalPnL / (totalValue - totalPnL)) * 100).toFixed(2) : 0}% overall return
            </p>
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
              <h1 className="text-3xl font-bold text-blue-400">{holdings.length}</h1>
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
              <h1 className="text-3xl font-bold text-purple-400">
                {daysChange >= 0 ? "+" : "-"}${Math.abs(daysChange).toFixed(2)}
              </h1>
            </div>
            <p className="text-purple-300 text-xs">
              {totalValue > 0 ? ((daysChange / (totalValue - daysChange)) * 100).toFixed(2) : 0}% today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Sections */}
      <PortfolioOverview holdings={holdings} prices={prices} />
      <PortfolioDashboard holdings={holdings} prices={prices} recentTrades={recentTrades} />
    </>
  );
};

export default Portfolio;
