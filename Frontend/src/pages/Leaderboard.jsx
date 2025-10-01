import React, { useEffect, useState } from "react";
import { socket, subscribeMarket } from "../services/socket";
import { Button } from "../components/ui/Button";
import { TraderBox, TraderBody } from "../components/ui/Card";
import TraderCard from "../components/TraderCard";
import LeaderboardTable from "../components/LeaderboardTable";

const Leaderboard = ({ market = "BTC_USDT" }) => {
  const [traders, setTraders] = useState([]);

  useEffect(() => {
    // Subscribe to the market room
    subscribeMarket(market);

    // Handle updates from backend
    const handleUpdate = (data) => {
      // Sort by ROI descending
      const sorted = data.sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi));
      setTraders(sorted);
    };

    socket.on("strategiesUpdate", handleUpdate);

    return () => {
      socket.off("strategiesUpdate", handleUpdate);
    };
  }, [market]);

  // Top 3 traders for cards
  const topTraders = traders.slice(0, 3);

  return (
    <div className="min-h-screen p-10 bg-gray-1000 text-blue-600">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Leaderboard
        </h1>
        <Button variant="outline" className="rounded-full border-gray-400 text-gray-800 hover:bg-black">
          Live Updates
        </Button>
      </div>

      {/* Your Ranking Card */}
      <TraderBox className="bg-green-100 border border-green-300 shadow-md text-gray-900 mb-6">
        <TraderBody className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Your Ranking</h2>
            <p className="opacity-80">trader@example.com</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">#247</p>
            <p className="text-green-700 font-medium">+12.5% ROI</p>
          </div>
        </TraderBody>
      </TraderBox>

      {/* Top 3 Traders Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {topTraders.map((trader) => (
          <TraderCard
            key={trader.rank || trader.symbol}
            trader={trader}
            cardStyle="bg-white/90 text-gray-900 border border-gray-300 shadow-md"
          />
        ))}
      </div>

      {/* Full Leaderboard Table */}
      <LeaderboardTable traders={traders} tableStyle="bg-white/90 text-gray-900 border border-gray-300" />
    </div>
  );
};

export default Leaderboard;
