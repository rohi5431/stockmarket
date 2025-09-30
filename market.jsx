import React from "react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"; 
import MarketDashboard from "../components/MarketDashboard";
import Search from "../components/Search";

const sampleChart = [
{ time: "9:30", price: 178 },
{ time: "10:00", price: 179 },
{ time: "10:30", price: 178.5 },
{ time: "11:00", price: 179.8 },
{ time: "11:30", price: 180.2 },
{ time: "12:00", price: 180.0 },
{ time: "12:30", price: 180.5 },
];

const watchlistData = [
{ symbol: "AAPL", price: 184.03, change: "+7.57%", delta: "+$12.95" },
{ symbol: "TSLA", price: 252.49, change: "+0.31%", delta: "+$0.79" },
{ symbol: "BTC", price: 43247.42, change: "+2.97%", delta: "+$1247.42" },
{ symbol: "NVDA", price: 424.6, change: "+3.73%", delta: "+$15.25" },
];

const movers = [
{ symbol: "NVDA", price: "$421.8", change: "+3.0%" },
{ symbol: "AMZN", price: "$151.94", change: "+3.2%" },
{ symbol: "BTC", price: "$43250", change: "+2.9%" },
{ symbol: "AAPL", price: "$175.2", change: "+2.4%" },
];

  const Market = () => {
  const [selected, setSelected] = useState(watchlistData[0]);
  const [orderType, setOrderType] = useState("Market Order");
  const [quantity, setQuantity] = useState(0);
  const [availableBalance] = useState("₹1,25,000"); 
  const [search, setSearch] = useState("");
  
  useEffect(() => {
  // small visual effect: rotate selected highlight if needed
  }, [selected]);

  const placeOrder = (side) => {
    const qty = Number(quantity);
    if(!qty || qty <= 0){
        alert("Please enter a valid quantity.");
    return;
    }
    // in a real app call API here
    alert(`${side} order placed: ${qty} ${selected.symbol} (${orderType})`);
    setQuantity(0);
    setSelected(watchlistData[0]);
   };
    const filteredWatch = watchlistData.filter((w) =>
    w.symbol.toLowerCase().includes(search.toLowerCase())
    );
    

  return (
      <div className="min-h-screen p-6 md:p-8 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-slate-100">
          <Search />
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
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
                         aria-label="Search watchlist"
                         />
                         <button onClick={() => setSearch("")} className="px-3 py-2 bg-slate-700/40 rounded-xl text-sm">
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
                <div className="rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 p-4 shadow-xl border border-slate-700/40">
                    <h3 className="text-lg font-semibold mb-3">Top Movers</h3>
                    <div className="flex gap-3 mb-4">
                        <button className="px-3 py-2 bg-slate-700/30 rounded-full text-sm">Gainers</button>
                        <button className="px-3 py-2 bg-transparent rounded-full text-sm opacity-70">Losers</button>
                    </div>
                    <ul className="space-y-3">
                    {movers.map((m) => (
                    <li key={m.symbol} className="flex items-center justify-between">
                    <div>
                        <div className="font-medium">{m.symbol}</div>
                        <div className="text-xs opacity-70">{m.price}</div>
                    </div>
                    <div className="text-sm text-green-400">{m.change}</div>
                    </li>
                    ))}
                    </ul>
                </div>
             </aside>
             {/* Middle Dashboard */}
              <div className="lg:col-span-6">
                <MarketDashboard />
              </div>
             {/* Middle column: Market Card + Chart */}
             <aside className="lg:col-span-3">
                <div className="sticky top-6 rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-800/30 p-6 shadow-xl border border-slate-700/40">
                    <h3 className="text-lg font-semibold mb-3">Trade {selected.symbol}</h3>
                    
                    <label className="text-sm opacity-80">Order Type</label>
                    <div className="mt-2 mb-4">
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="w-full bg-transparent border border-slate-700/40 px-3 py-2 rounded-xl outline-none"
                    >
                    <option>Market Order</option>
                    <option>Limit Order</option>
                    <option>Stop Loss</option>
                    </select>
               </div>
               <label className="text-sm opacity-80">Quantity</label>
               <input
                   inputMode="numeric"
                   value={quantity}
                   onChange={(e) => setQuantity(e.target.value)}
                   placeholder="Enter quantity"
                   className="w-full bg-transparent border border-slate-700/40 px-3 py-2 rounded-xl outline-none mb-4"
               />

               <div className="mb-4">
                  <div className="text-sm opacity-70">Current Price</div>
                  <div className="text-2xl font-bold mt-1">${selected.price}</div>
               </div>

               <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => placeOrder('Buy')}
                    className="flex-1 px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-semibold"
                    >
                   Buy
                   </button>
                  <button
                   onClick={() => placeOrder('Sell')}
                   className="flex-1 px-4 py-2 rounded-2xl bg-red-600 hover:bg-red-500 font-semibold"
                   >
                   Sell
                  </button>
              </div>
              <div className="text-sm opacity-80">Available Balance</div>
                 <div className="text-lg font-bold text-emerald-400 mt-1">{availableBalance}</div>
                 <div className="mt-6 text-xs opacity-60">Orders are simulated in this demo. Connect a broker API to enable real trading.</div>
              </div>
          </aside>

          {/* Mobile / small-screen compact market overview */}
          <div className="lg:hidden col-span-1">
            {selected && (
              <div className="rounded-2xl bg-slate-800/50 p-3 mt-4">
              <div className="flex items-center justify-between">
              <div>
              <div className="font-semibold">{selected.symbol}</div>
              <div className="text-sm opacity-70">${selected.price}</div>
          </div>
          <div className="text-green-400">{selected.change}</div>
            </div>
            </div>
           )}
      </div>

    </div>
   </div>
  );
};
export default Market;
