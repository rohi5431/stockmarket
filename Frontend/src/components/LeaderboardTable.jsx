import React, { useEffect, useState } from "react";
import { socket, subscribeMarket } from "../services/socket";
import { Users, Zap, Star, UserPlus } from "lucide-react";

const LeaderboardTable = ({ market = "BTC_USDT" }) => {
  const [traders, setTraders] = useState([]);

  useEffect(() => {
    subscribeMarket(market);
    const handleUpdate = (data) => {
      setTraders(data);
    };

    socket.on("strategiesUpdate", handleUpdate);
    return () => {
      socket.off("strategiesUpdate", handleUpdate);
    };
  }, [market]);

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg text-white mt-8">
      <h2 className="text-xl font-bold mb-6">Full Rankings - {market}</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-gray-400 border-b border-gray-700">
            <tr>
              <th className="py-2">Rank</th>
              <th className="py-2">Trader</th>
              <th className="py-2">ROI</th>
              <th className="py-2">Total Return</th>
              <th className="py-2">Followers</th>
              <th className="py-2">Win Rate</th>
              <th className="py-2">Streak</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {traders.map((t) => (
              <tr
                key={t.rank || t.symbol}
                className="border-b border-gray-800 hover:bg-gray-800/50"
              >
                <td className="py-3 font-bold text-indigo-400">#{t.rank}</td>
                <td className="py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.username}</p>
                  </div>
                  {t.mentor && (
                    <span className="ml-2 bg-indigo-600 px-2 py-1 rounded text-xs">
                      Mentor
                    </span>
                  )}
                </td>
                <td className="py-3 text-green-400">{t.roi}</td>
                <td className="py-3">{t.return}</td>
                <td className="py-3 flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" /> {t.followers}
                </td>
                <td className="py-3">{t.winRate}</td>
                <td className="py-3 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-orange-400" /> {t.streak}
                </td>
                <td className="py-3">
                  {t.following ? (
                    <button className="bg-gray-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-400" /> Following
                    </button>
                  ) : (
                    <button className="bg-indigo-600 px-3 py-1 rounded-lg flex items-center gap-1 text-sm hover:bg-indigo-500">
                      <UserPlus className="w-4 h-4" /> Follow
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
