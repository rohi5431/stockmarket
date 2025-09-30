import React, { useEffect, useState } from "react";
import { socket, subscribeMarket } from "../services/socket";
import { TraderBox, TraderBody } from "../components/ui/Card";
import { Button } from "@/components/ui/button";

const TopTraders = ({ market = "BTC_USDT" }) => {
  const [traders, setTraders] = useState([]);

  useEffect(() => {
    subscribeMarket(market);

    const handleUpdate = (data) => {
      const topTraders = data
        .sort((a, b) => parseFloat(b.roi) - parseFloat(a.roi))
        .slice(0, 3); 
      setTraders(topTraders);
    };

    socket.on("strategiesUpdate", handleUpdate);

    return () => {
      socket.off("strategiesUpdate", handleUpdate);
    };
  }, [market]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {traders.map((trader) => (
        <TraderCard key={trader.rank || trader.symbol} trader={trader} />
      ))}
    </div>
  );
};

const TraderCard = ({ trader }) => {
  return (
    <TraderBox className="relative w-full h-[26rem] bg-gray-900 text-white rounded-2xl shadow-lg overflow-hidden">
      <div className="absolute top-4 left-4 text-yellow-400 text-2xl font-extrabold">
        #{trader.rank}
      </div>

      <TraderBody className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-700 text-2xl font-bold">
          {trader.name.charAt(0)}
        </div>

        <h3 className="text-xl font-semibold">{trader.name}</h3>
        <p className="text-sm text-gray-400">{trader.username}</p>

        <p className="text-green-400 font-bold text-lg">{trader.roi}</p>
        <p className="text-sm text-gray-300">{trader.return}</p>

        <p className="text-sm text-gray-400">
          {trader.followers} • {trader.winRate}
        </p>
        <Button
          className={`rounded-full px-6 py-2 mt-4 transition ${
            trader.isFollowing
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {trader.isFollowing ? "Following" : "Follow"}
        </Button>
      </TraderBody>
    </TraderBox>
  );
};

export default TopTraders;
