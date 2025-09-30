import React, { useEffect, useState } from "react";

const FINNHUB_SOCKET = "wss://ws.finnhub.io?token=d3447lpr01qqt8snf1ggd3447lpr01qqt8snf1h0";
const FINNHUB_REST = "https://finnhub.io/api/v1/quote?symbol=";
const API_KEY = "d3447lpr01qqt8snf1ggd3447lpr01qqt8snf1h0";

const indices = [
  { symbol: "NIFTYBEES", name: "NIFTY 50" },
  { symbol: "SPY", name: "S&P 500" },
  { symbol: "QQQ", name: "NASDAQ 100" },
  { symbol: "DIA", name: "DOW JONES" },
];

const MarketTicker = () => {
  const [prices, setPrices] = useState({});
  const [previousClose, setPreviousClose] = useState({});

  useEffect(() => {
    const fetchPrevClose = async () => {
      for (let i of indices) {
        try {
          const res = await fetch(`${FINNHUB_REST}${i.symbol}&token=${API_KEY}`);
          const data = await res.json();
          if (data && data.pc) {
            setPreviousClose(prev => ({ ...prev, [i.symbol]: data.pc }));
          }
        } catch (err) {
          console.error("Error fetching previous close:", err);
        }
      }
    };
    fetchPrevClose();
  }, []);

  useEffect(() => {
    const socket = new WebSocket(FINNHUB_SOCKET);

    socket.onopen = () => {
      console.log("WebSocket connected ✅");
      indices.forEach(i => socket.send(JSON.stringify({ type: "subscribe", symbol: i.symbol })));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "trade" && data.data?.length) {
        const trade = data.data[0];
        setPrices(prev => ({ ...prev, [trade.s]: trade.p }));
      }
    };

    socket.onerror = (err) => console.error("WebSocket error:", err);
    socket.onclose = () => console.log("WebSocket closed ❌");

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        indices.forEach(i => socket.send(JSON.stringify({ type: "unsubscribe", symbol: i.symbol })));
      }
      socket.close();
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white py-6 px-4 rounded-lg shadow-lg overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Live Market Ticker</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="px-4 py-2 text-left">Index</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Change %</th>
            <th className="px-4 py-2 text-left">Trend</th>
          </tr>
        </thead>
        <tbody>
          {indices.map(i => {
            const current = prices[i.symbol];
            const prevClose = previousClose[i.symbol];

            let changePct = "-";
            let arrow = "-";
            let color = "text-gray-300";

            if (current && prevClose) {
              changePct = ((current - prevClose) / prevClose) * 100;
              if (changePct > 0) { color = "text-green-400"; arrow = "▲"; }
              else if (changePct < 0) { color = "text-red-400"; arrow = "▼"; }
              changePct = changePct.toFixed(2);
            }

            return (
              <tr key={i.symbol} className="border-b border-gray-700">
                <td className="px-4 py-2 font-semibold">{i.name}</td>
                <td className="px-4 py-2 font-mono">{current ? current.toFixed(2) : "Loading..."}</td>
                <td className={`px-4 py-2 font-mono ${color}`}>{current ? `${changePct}%` : "-"}</td>
                <td className={`px-4 py-2 font-mono ${color}`}>{arrow}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MarketTicker;
