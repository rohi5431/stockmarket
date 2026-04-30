import React, { useState, useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { getNews } from "../services/marketService";

const FINNHUB_REST = "https://finnhub.io/api/v1/quote?symbol=";
const API_KEY = "d3447lpr01qqt8snf1ggd3447lpr01qqt8snf1h0";

const movers = ["TSLA", "INFY", "AMZN", "WIPRO", "AAPL"];
const cryptos = [
  { symbol: "BINANCE:BTCUSDT", name: "BTC" },
  { symbol: "BINANCE:ETHUSDT", name: "ETH" },
  { symbol: "BINANCE:DOGEUSDT", name: "DOGE" },
];

const TopMovers = ({ title, color, data }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <h2
      className={`text-xl font-bold mb-4 ${
        color === "green" ? "text-green-600" : "text-red-600"
      }`}
    >
      {title}
    </h2>
    {data.length === 0 ? (
      <p className="text-gray-500 text-sm">Loading market data...</p>
    ) : (
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.symbol}
            className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-xl transition"
          >
            <div className="flex flex-col">
              <span className="font-bold text-gray-800">{item.symbol.replace('BINANCE:', '')}</span>
              <span className="text-xs text-gray-500 font-mono">${item.price.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`font-semibold ${
                  color === "green" ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.change > 0 ? "+" : ""}{item.change.toFixed(2)}%
              </span>
              <div className="mt-1">
                <Sparklines data={item.sparkline || []} width={60} height={20}>
                  <SparklinesLine
                    color={color === "green" ? "#16a34a" : "#dc2626"}
                    style={{ strokeWidth: 3, fill: "none" }}
                  />
                </Sparklines>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const MarketDashboard = () => {
  const [prices, setPrices] = useState({});
  const [prevClose, setPrevClose] = useState({});
  const [sparklines, setSparklines] = useState({});
  const [news, setNews] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch previous close
  useEffect(() => {
    const fetchPrev = async () => {
      const symbols = [...movers, ...cryptos.map((c) => c.symbol)];

      for (let sym of symbols) {
        try {
          const res = await fetch(`${FINNHUB_REST}${sym}&token=${API_KEY}`);
          const data = await res.json();

          if (data.pc) {
            setPrevClose((prev) => ({ ...prev, [sym]: data.pc }));
          }
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchPrev();
  }, []);

  // Fetch LIVE prices
  useEffect(() => {
    const fetchPrices = async () => {
      const symbols = [...movers, ...cryptos.map((c) => c.symbol)];

      for (let sym of symbols) {
        try {
          const res = await fetch(`${FINNHUB_REST}${sym}&token=${API_KEY}`);
          const data = await res.json();

          if (data.c) {
            setPrices((prev) => ({
              ...prev,
              [sym]: data.c,
            }));

            setSparklines((prev) => {
              const arr = prev[sym] || [];
              return {
                ...prev,
                [sym]: [...arr.slice(-19), data.c],
              };
            });
          }
        } catch (err) {
          console.error(err);
        }
      }

      setLastUpdated(new Date());
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 10000); // every 10 sec

    return () => clearInterval(interval);
  }, []);

  // News from backend
  useEffect(() => {
    const fetchNewsData = async () => {
      const data = await getNews();
      setNews(data.slice(0, 4));
    };
    fetchNewsData();
  }, []);

  // Compute movers
  const computeMovers = () => {
    const gainers = [];
    const losers = [];

    [...movers, ...cryptos.map((c) => c.symbol)].forEach((s) => {
      const current = prices[s];
      const prev = prevClose[s];

      if (current && prev) {
        const change = ((current - prev) / prev) * 100;

        const item = {
          symbol: s,
          price: current,
          change,
          sparkline: sparklines[s],
        };

        if (change > 0) gainers.push(item);
        else losers.push(item);
      }
    });

    return {
      topGainers: gainers.sort((a, b) => b.change - a.change).slice(0, 4),
      topLosers: losers.sort((a, b) => a.change - b.change).slice(0, 4),
    };
  };

  const { topGainers, topLosers } = computeMovers();

  return (
    <div className="py-16 px-6 bg-gray-50 border-t border-gray-200" id="live-news">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            📊 Live Market Overview
          </h1>
          <p className="text-gray-500 font-medium">
            Stay updated with real-time stock and crypto movements.
            <span className="block mt-1 text-sm">
              Last Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "Loading..."}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TopMovers title="🚀 Top Gainers" color="green" data={topGainers} />
          <TopMovers title="🔻 Top Losers" color="red" data={topLosers} />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            📰 Breaking Market News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.length > 0 ? news.map((n, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition border border-gray-100">
                {n.image && (
                  <img
                    src={n.image}
                    alt={n.headline}
                    className="w-24 h-24 object-cover rounded-lg shadow-sm"
                  />
                )}
                <div className="flex flex-col justify-between">
                  <a
                    href={n.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-900 font-semibold hover:text-blue-600 line-clamp-2 leading-snug"
                  >
                    {n.headline}
                  </a>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {n.summary}
                  </p>
                  <p className="text-xs text-gray-400 mt-2 font-medium">
                    {n.source} • {new Date(n.datetime * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm py-4">Loading latest news...</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketDashboard;