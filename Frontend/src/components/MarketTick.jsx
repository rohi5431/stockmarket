import React, { useState, useEffect } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";

const FINNHUB_SOCKET = "wss://ws.finnhub.io?token=d3447lpr01qqt8snf1ggd3447lpr01qqt8snf1h0";
const FINNHUB_REST = "https://finnhub.io/api/v1/quote?symbol=";
const NEWS_API = "https://finnhub.io/api/v1/news?category=general&token=";
const API_KEY = "d3447lpr01qqt8snf1ggd3447lpr01qqt8snf1h0";

const movers = ["TSLA", "INFY", "AMZN", "WIPRO", "AAPL"];
const cryptos = [
  { symbol: "BINANCE:BTCUSDT", name: "BTC" },
  { symbol: "BINANCE:ETHUSDT", name: "ETH" },
  { symbol: "BINANCE:DOGEUSDT", name: "DOGE" },
];

// Top Movers Card
const TopMovers = ({ title, color, data }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2
      className={`text-xl font-bold mb-4 ${
        color === "green" ? "text-green-600" : "text-red-600"
      }`}
    >
      {title}
    </h2>
    {data.length === 0 ? (
      <p className="text-gray-500">No data available</p>
    ) : (
      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.symbol}
            className="flex justify-between items-center bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800">{item.symbol}</span>
              <span className="text-sm text-gray-500">{item.name || ""}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`${
                  color === "green" ? "text-green-600" : "text-red-600"
                } font-mono`}
              >
                {item.price.toFixed(2)}
              </span>
              <span
                className={`${
                  color === "green" ? "text-green-600" : "text-red-600"
                } font-mono`}
              >
                {item.change.toFixed(2)}%
              </span>
              <Sparklines data={item.sparkline || []} width={80} height={24}>
                <SparklinesLine
                  color={color === "green" ? "#16a34a" : "#dc2626"}
                />
              </Sparklines>
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
  const [stats, setStats] = useState({
    stocksTracked: 0,
    trades: 0,
    marketCap: 120,
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [now, setNow] = useState(new Date());

  // Fetch previous close
  useEffect(() => {
    const fetchPrev = async () => {
      const symbols = [...movers, ...cryptos.map((c) => c.symbol)];
      for (let sym of symbols) {
        try {
          const res = await fetch(`${FINNHUB_REST}${sym}&token=${API_KEY}`);
          const data = await res.json();
          if (data.pc)
            setPrevClose((prev) => ({ ...prev, [sym]: data.pc }));
        } catch (err) {
          console.error("prevClose error:", err);
        }
      }
    };
    fetchPrev();
  }, []);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${NEWS_API}${API_KEY}`);
        const data = await res.json();
        setNews(data.slice(0, 8));
      } catch (err) {
        console.error(err);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 120000);
    return () => clearInterval(interval);
  }, []);

  // Live clock
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // WebSocket
  useEffect(() => {
    const socket = new WebSocket(FINNHUB_SOCKET);
    socket.onopen = () => {
      const symbols = [...movers, ...cryptos.map((c) => c.symbol)];
      symbols.forEach((s) =>
        socket.send(JSON.stringify({ type: "subscribe", symbol: s }))
      );
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "trade" && data.data?.length) {
        const trade = data.data[0];
        setPrices((prev) => ({ ...prev, [trade.s]: trade.p }));
        setPrevClose((prev) =>
          prev[trade.s] ? prev : { ...prev, [trade.s]: trade.p }
        );
        setSparklines((prev) => {
          const arr = prev[trade.s] || [];
          return { ...prev, [trade.s]: [...arr.slice(-19), trade.p] };
        });
        setStats((prev) => ({
          ...prev,
          trades: prev.trades + 1,
          stocksTracked: new Set([...Object.keys(prev), trade.s]).size,
          marketCap: prev.marketCap + Math.random() * 0.01,
        }));
        setLastUpdated(new Date());
      }
    };
    return () => socket.close();
  }, []);

  // Top movers
  const computeMovers = () => {
    const gainers = [];
    const losers = [];
    const symbols = [...movers, ...cryptos.map((c) => c.symbol)];
    symbols.forEach((s) => {
      const current = prices[s];
      const prev = prevClose[s];
      if (current != null && prev != null) {
        const change = ((current - prev) / prev) * 100;
        if (change > 0)
          gainers.push({
            symbol: s,
            price: current,
            change,
            sparkline: sparklines[s],
          });
        else if (change < 0)
          losers.push({
            symbol: s,
            price: current,
            change,
            sparkline: sparklines[s],
          });
      }
    });
    gainers.sort((a, b) => b.change - a.change);
    losers.sort((a, b) => a.change - b.change);
    return {
      topGainers: gainers.slice(0, 5),
      topLosers: losers.slice(0, 5),
    };
  };

  const { topGainers, topLosers } = computeMovers();
  const formatTime = (date) =>
    date ? date.toLocaleTimeString("en-US", { hour12: false }) : "—";

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900 p-6 space-y-12">
      {/* Live Market Ticker */}
      <div className="w-full bg-white py-4 px-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          Live Market Ticker
        </h2>
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-100">
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Change %</th>
              <th className="px-4 py-2">Trend</th>
            </tr>
          </thead>
          <tbody>
            {[...movers, ...cryptos.map((c) => c.symbol)].map((s, i) => {
              const current = prices[s];
              const prev = prevClose[s];
              let color = "text-gray-600";
              let arrow = "-";
              let changePercent = "-";
              if (current != null && prev != null) {
                const change = ((current - prev) / prev) * 100;
                changePercent = change.toFixed(2);
                if (change > 0) {
                  color = "text-green-600";
                  arrow = "▲";
                } else if (change < 0) {
                  color = "text-red-600";
                  arrow = "▼";
                }
              }
              return (
                <tr
                  key={s}
                  className={`border-b border-gray-200 ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-2 font-mono">{s}</td>
                  <td className="px-4 py-2 font-mono">
                    {current ? current.toFixed(2) : "Loading..."}
                  </td>
                  <td className={`px-4 py-2 font-mono ${color}`}>
                    {current ? changePercent + "%" : "-"}
                  </td>
                  <td className={`px-4 py-2 font-mono ${color}`}>{arrow}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Top Movers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TopMovers title="Top Gainers" color="green" data={topGainers} />
        <TopMovers title="Top Losers" color="red" data={topLosers} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg text-blue-700">Stocks Tracked</h3>
          <p className="text-3xl font-bold">{stats.stocksTracked}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg text-blue-700">Trades Executed</h3>
          <p className="text-3xl font-bold">
            {stats.trades.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg text-blue-700">Market Cap (Tn)</h3>
          <p className="text-3xl font-bold">
            {stats.marketCap.toFixed(2)}
          </p>
        </div>
      </div>

      {/* News */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-yellow-600 mb-6">Live News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((n, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row bg-gray-50 rounded-lg overflow-hidden shadow hover:shadow-md transition"
            >
              {n.image && (
                <img
                  src={n.image}
                  alt="news"
                  className="w-full md:w-48 h-48 object-cover"
                />
              )}
              <div className="p-4 flex flex-col justify-between">
                <p className="font-semibold text-gray-800">{n.headline}</p>
                <p className="text-xs text-gray-500 mt-2">{n.source}</p>
                <a
                  href={n.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 mt-2 hover:underline"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm">
        Last Updated: {lastUpdated ? formatTime(lastUpdated) : "Waiting..."}{" "}
        <span className="ml-2 text-xs text-gray-400">
          (Local time: {formatTime(now)})
        </span>
      </p>
    </div>
  );
};

export default MarketDashboard;
