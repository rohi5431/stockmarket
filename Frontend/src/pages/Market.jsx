import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { getQuote, getHistorical } from "../services/marketService";
import Search from "../components/Search";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { WalletContext } from "../context/WalletContext.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

const initialWatchlist = [
  { symbol: "AAPL", price: 184.03, change: "+7.57%", delta: "+$12.95" },
  { symbol: "TSLA", price: 252.49, change: "+0.31%", delta: "+$0.79" },
  { symbol: "BTC", price: 43247.42, change: "+2.97%", delta: "+$1247.42" },
  { symbol: "NVDA", price: 424.6, change: "+3.73%", delta: "+$15.25" },
];

const movers = [
  { symbol: "NVDA", price: 421.8, change: "+3.0%" },
  { symbol: "AMZN", price: 151.94, change: "+3.2%" },
  { symbol: "BTC", price: 43250, change: "+2.9%" },
  { symbol: "AAPL", price: 175.2, change: "+2.4%" },
];

const Market = () => {
  const { balance, setBalance } = useContext(WalletContext);
  const { addNotification } = useNotification();

  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [selected, setSelected] = useState(initialWatchlist[0]);
  const [orderType, setOrderType] = useState("Market");
  const [quantity, setQuantity] = useState("");
  const [search, setSearch] = useState("");
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Fetch historical chart data
   useEffect(() => {
    const loadHistorical = async () => {
      try {
        setChartLoading(true);
        const data = await getHistorical(selected.symbol);

        if (!data || !data.length) {
          setChartData([]);
          return;
        }

        const formatted = data.map((item) => ({
          time: new Date(item.t * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          price: item.c,
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("Failed to load historical data", err);
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    };

    loadHistorical();
  }, [selected.symbol]);

  // 2️⃣ Append live price every 10s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const quote = await getQuote(selected.symbol);
        const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        setChartData((prev) => [
          ...prev.slice(-50), // keep last 50 points to avoid huge data
          { time: now, price: quote.c },
        ]);
      } catch (err) {
        console.error("Failed to fetch live quote", err);
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [selected.symbol]);


  // Fetch latest prices
  const fetchPrices = async (symbols) => {
    const data = {};
    for(let symbol of symbols){
      try{
        const quote = await getQuote(symbol);
        data[symbol] = quote;
      } 
      catch(e){
        console.error(`Failed to fetch ${symbol}:`, e.message);
      }
    }
    return data;
  };

  useEffect(() => {
    const symbols = initialWatchlist.map((item) => item.symbol);
    const updatePrices = async () => {
      const updatedData = await fetchPrices(symbols);
      const updatedWatchlist = initialWatchlist.map((item) => {
        const quote = updatedData[item.symbol];
        if(quote && typeof quote.c === "number" && typeof quote.pc === "number" && quote.pc !== 0){
          const change = ((quote.c - quote.pc) / quote.pc) * 100;
          return {
            ...item,
            price: quote.c.toFixed(2),
            change: `${change.toFixed(2)}%`,
            delta: `$${(quote.c - quote.pc).toFixed(2)}`,
          };
        } else {
        return{
         ...item,
         price: "N/A",
         change: "N/A",
         delta: "N/A",
        }
        };
      });
      setWatchlist(updatedWatchlist);
      setSelected(
        updatedWatchlist.find((w) => w.symbol === selected.symbol) ||
          updatedWatchlist[0]
      );
    };

    updatePrices();
    const interval = setInterval(updatePrices, 10000);
    return () => clearInterval(interval);
  }, [selected]);

  // Place buy/sell orders
  const placeOrder = async (side) => {
    const qtyNum = Number(quantity);
    if (!qtyNum || qtyNum <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    const priceNum = Number(selected.price);
    const totalCost = qtyNum * priceNum;

    if(side === "BUY" && totalCost > balance){
      alert("Insufficient balance to place this order.");
      return;
    }

    const order = {
      side: side.toLowerCase(),
      symbol: selected.symbol,
      qty: qtyNum,
      orderType: orderType.toLowerCase(),
      price: priceNum,
      time: new Date().toISOString(),
    };

    try{
      await axios.post("http://localhost:5000/api/order", order);

      if(side === "BUY"){
        setBalance((prev) => prev - totalCost);
        addNotification(`Bought ${qtyNum} ${selected.symbol} for $${totalCost.toFixed(2)}`);
      } 
      else{
        setBalance((prev) => prev + totalCost);
        addNotification(`Sold ${qtyNum} ${selected.symbol} for $${totalCost.toFixed(2)}`);
      }

      setQuantity("");
    } 
    catch(err){
      console.error("Order failed", err.response?.data || err.message);
      alert(`Order failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const filteredWatch = watchlist.filter((w) =>
    w.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-slate-100">
      <Search />
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Watchlist Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 p-4 shadow-xl border border-slate-700/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Watchlist</h3>
              <div className="text-sm opacity-70">{filteredWatch.length} items</div>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search symbol..."
                className="flex-1 bg-transparent placeholder-slate-400 outline-none px-3 py-2 rounded-xl border border-slate-700/40"
              />
              <button
                onClick={() => setSearch("")}
                className="px-3 py-2 bg-slate-700/40 rounded-xl text-sm"
              >
                Clear
              </button>
            </div>
            <div className="space-y-3">
              {filteredWatch.map((item) => (
                <button
                  key={item.symbol}
                  onClick={() => setSelected(item)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-shadow border ${
                    item.symbol === selected.symbol
                      ? "bg-slate-700/60 border-sky-500/40 shadow-inner"
                      : "bg-slate-800/40 border-slate-700/30"
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold">{item.symbol}</div>
                    <div className="text-sm opacity-70">${item.price}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400 font-medium">{item.change}</div>
                    <div className="text-xs opacity-80">{item.delta}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Top Movers */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 p-4 shadow-xl border border-slate-700/40">
            <h3 className="text-lg font-semibold mb-3">Top Movers</h3>
            <ul className="space-y-3">
              {movers.map((m) => (
                <li key={m.symbol} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{m.symbol}</div>
                    <div className="text-xs opacity-70">${m.price}</div>
                  </div>
                  <div className="text-sm text-green-400">{m.change}</div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Market Chart */}
        <div className="lg:col-span-6">
          <div className="bg-slate-800/40 p-4 rounded-2xl">
            {chartLoading ? (
              <div className="text-center text-sm py-10 text-slate-400">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <XAxis dataKey="time" />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#00f5d4"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Trade Section */}
        <aside className="lg:col-span-3">
          <div className="sticky top-6 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 p-6 shadow-xl border border-slate-700/40">
            <h3 className="text-lg font-semibold mb-3">Trade {selected.symbol}</h3>

            <label className="text-sm opacity-80">Select Company</label>
            <div className="mt-2 mb-4">
              <select
                value={selected.symbol}
                onChange={(e) => {
                  const company = watchlist.find((w) => w.symbol === e.target.value);
                  if (company) setSelected(company);
                }}
                className="w-full bg-transparent border border-slate-700/40 px-3 py-2 rounded-xl outline-none"
              >
                {watchlist.map((item) => (
                  <option key={item.symbol} value={item.symbol}>
                    {item.symbol} — ${item.price}
                  </option>
                ))}
              </select>
            </div>

            <label className="text-sm opacity-80">Order Type</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full mt-1 bg-transparent border border-slate-700/40 px-3 py-2 rounded-xl outline-none"
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
            </select>

            <label className="text-sm opacity-80 mt-4 block">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full mt-1 bg-transparent border border-slate-700/40 px-3 py-2 rounded-xl outline-none"
              min="1"
            />

            <div className="mt-4">
              <div className="text-sm opacity-70">Current Price</div>
              <div className="text-2xl font-bold mt-1">${selected.price}</div>
            </div>

            {quantity > 0 && (
              <div className="mt-2">
                <div className="text-sm opacity-70">Total Amount</div>
                <div className="text-xl font-semibold text-amber-400 mt-1">
                  ${(quantity * selected.price).toFixed(2)}
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="text-sm opacity-70">Available Balance</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">
                ${balance.toLocaleString()}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => placeOrder("BUY")}
                className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-500 transition-colors"
                disabled={quantity > 0 && quantity * selected.price > balance}
              >
                Buy
              </button>
              <button
                onClick={() => placeOrder("SELL")}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 transition-colors"
              >
                Sell
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Market;
