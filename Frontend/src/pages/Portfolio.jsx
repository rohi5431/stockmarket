import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { FiActivity, FiFilter } from "react-icons/fi";
import { FaBullseye } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
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

  // Fetch holdings
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

  // Fetch prices
  useEffect(() => {
    if (!holdings.length) return;

    const fetchPrices = async () => {
      const updatedPrices = {};
      for (let h of holdings) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/quote/${h.symbol}`
          );
          updatedPrices[h.symbol] = res.data;
        } catch (err) {
          console.error(`Failed to fetch price for ${h.symbol}`, err);
        }
      }
      setPrices(updatedPrices);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000);
    return () => clearInterval(interval);
  }, [holdings]);

  // Fetch trades
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/trades");
        setRecentTrades(res.data);
      } catch (err) {
        console.error("Failed to fetch trades:", err);
      }
    };
    fetchTrades();
  }, []);

  // Calculate totals
  useEffect(() => {
    let value = 0;
    let pnl = 0;
    let dayDiff = 0;

    holdings.forEach((h) => {
      const priceData = prices[h.symbol];
      if (priceData) {
        const currentPrice = priceData.current;
        const change = currentPrice - h.avgPrice;
        const todayChange = currentPrice - priceData.open;

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
      <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-6 bg-gray-100 rounded-xl shadow-md hover:shadow-lg transition">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800">
            📊 Portfolio Overview
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your holdings and performance
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm rounded-lg border border-gray-300 hover:bg-gray-200 transition shadow-sm">
            <FiFilter size={16} />
            Filter
          </button>
          <ExportFile holdings={holdings} trades={recentTrades} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 mt-6">
        {/* Total Value */}
        <Card className="bg-green-50 border border-green-200 rounded-lg transition hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex justify-between mb-2 text-green-600 text-sm font-semibold">
              <p>Total Value</p>
              <span>$</span>
            </div>
            <h1 className="text-4xl font-bold text-green-700">
              ${totalValue.toFixed(2)}
            </h1>
            <p className="text-green-500 text-xs mt-2">Portfolio value</p>
          </CardContent>
        </Card>

        {/* Total P&L */}
        <Card className="bg-green-50 border border-green-200 rounded-lg transition hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4 items-center">
              <div className="flex items-center text-green-600 font-semibold text-sm">
                <FiActivity className="text-green-700 mr-2" size={20} />
                Total's P&L
              </div>
              <h1 className="text-3xl font-bold text-green-700">
                {totalPnL >= 0 ? "+" : "-"}${Math.abs(totalPnL).toFixed(2)}
              </h1>
            </div>
            <p className="text-green-500 text-xs">
              {totalValue > 0
                ? ((totalPnL / (totalValue - totalPnL)) * 100).toFixed(2)
                : 0}
              % overall return
            </p>
          </CardContent>
        </Card>

        {/* Holdings */}
        <Card className="bg-blue-50 border border-blue-200 rounded-lg transition hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4 items-center">
              <div className="flex items-center text-blue-600 font-semibold text-sm">
                <FaBullseye className="text-blue-700 mr-2" size={20} />
                Holdings
              </div>
              <h1 className="text-3xl font-bold text-blue-700">
                {holdings.length}
              </h1>
            </div>
            <p className="text-blue-500 text-xs">Active positions</p>
          </CardContent>
        </Card>

        {/* Day's Change */}
        <Card className="bg-purple-50 border border-purple-200 rounded-lg transition hover:shadow-md hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex justify-between mb-4 items-center">
              <div className="flex items-center text-purple-600 font-semibold text-sm">
                <HiTrendingUp className="text-purple-700 mr-2" size={20} />
                Day's Change
              </div>
              <h1 className="text-3xl font-bold text-purple-700">
                {daysChange >= 0 ? "+" : "-"}${Math.abs(daysChange).toFixed(2)}
              </h1>
            </div>
            <p className="text-purple-500 text-xs">
              {totalValue > 0
                ? ((daysChange / (totalValue - daysChange)) * 100).toFixed(2)
                : 0}
              % today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Sections */}
      <PortfolioOverview holdings={holdings} prices={prices} />
      <PortfolioDashboard
        holdings={holdings}
        prices={prices}
        recentTrades={recentTrades}
      />
    </>
  );
};

export default Portfolio;
