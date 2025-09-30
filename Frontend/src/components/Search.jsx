import React from "react";
import { Search } from "lucide-react";

const MarketHeader = () => {
  return (
    <div className="w-full rounded-2xl bg-slate-900/60 border border-slate-700/40 p-5 md:p-6 shadow-lg mb-10">
      {/* Top row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
            Live Market
          </h2>
          <p className="text-sm text-slate-400">
            Track & trade in real-time with live data
          </p>
        </div>
        <span className="self-start md:self-center px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          ● Market Open
        </span>
      </div>

      {/* Search bar */}
      <div className="mt-5">
        <div className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-sky-500">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search stocks or crypto (AAPL, BTC, ETH)"
            className="w-full bg-transparent outline-none text-sm placeholder-slate-500"
          />
        </div>
      </div>
    </div>
  );
}

export default MarketHeader