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
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mt-8">
      <h2 className="text-xl font-bold mb-6 text-blue-700">
        Full Rankings - {market}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Trader</th>
              <th className="py-3 px-4">ROI</th>
              <th className="py-3 px-4">Total Return</th>
              <th className="py-3 px-4">Followers</th>
              <th className="py-3 px-4">Win Rate</th>
              <th className="py-3 px-4">Streak</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {traders.map((t) => (
              <tr
                key={t.rank || t.symbol}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                {/* Rank */}
                <td className="py-3 px-4 font-bold text-indigo-600">
                  #{t.rank}
                </td>

                {/* Trader Info */}
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.username}</p>
                  </div>
                  {t.mentor && (
                    <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                      Mentor
                    </span>
                  )}
                </td>

                {/* ROI */}
                <td
                  className={`py-3 px-4 font-medium ${
                    parseFloat(t.roi) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {t.roi}
                </td>

                {/* Return */}
                <td className="py-3 px-4 text-gray-700">{t.return}</td>

                {/* Followers */}
                <td className="py-3 px-4 flex items-center gap-1 text-gray-600">
                  <Users className="w-4 h-4 text-gray-500" /> {t.followers}
                </td>

                {/* Win Rate */}
                <td className="py-3 px-4 text-gray-700">{t.winRate}</td>

                {/* Streak */}
                <td className="py-3 px-4 flex items-center gap-1 text-orange-600 font-medium">
                  <Zap className="w-4 h-4" /> {t.streak}
                </td>

                {/* Action */}
                <td className="py-3 px-4">
                  {t.following ? (
                    <button className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm font-medium hover:bg-yellow-200 transition">
                      <Star className="w-4 h-4" /> Following
                    </button>
                  ) : (
                    <button className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg flex items-center gap-1 text-sm font-medium hover:bg-indigo-200 transition">
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
