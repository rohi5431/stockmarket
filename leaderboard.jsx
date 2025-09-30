import React from "react";
import { Button } from "../components/ui/Button";
import { Users, Zap, Star, UserPlus } from "lucide-react";
import { TraderBox, TraderBody } from "../components/ui/Card";

const TraderCard = ({ trader }) => {
  return (
    <TraderBox className="relative w-full h-[26rem] bg-gray-900 text-white rounded-2xl shadow-lg overflow-hidden">
      {/* Rank */}
      <div className="absolute top-4 left-4 text-yellow-400 text-2xl font-extrabold">
        #{trader.rank}
      </div>

      <TraderBody className="flex flex-col items-center justify-center h-full text-center space-y-4">
        {/* Avatar */}
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-700 text-2xl font-bold">
          {trader.name.charAt(0)}
        </div>

        {/* Name + Username */}
        <h3 className="text-xl font-semibold">{trader.name}</h3>
        <p className="text-sm text-gray-400">{trader.username}</p>

        {/* ROI + Return */}
        <p className="text-green-400 font-bold text-lg">{trader.roi}</p>
        <p className="text-sm text-gray-300">{trader.return}</p>

        {/* Followers + Win rate */}
        <p className="text-sm text-gray-400">
          {trader.followers} • {trader.winrate}
        </p>

        {/* Follow Button */}
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

// ✅ Top Traders Data
const traders = [
  {
    rank: 1,
    name: "Alex Chen",
    username: "@alexchen",
    roi: "+46.7% ROI",
    return: "$124,794.477 return",
    followers: "2847 followers",
    winrate: "78.2% win rate",
    isFollowing: true,
  },
  {
    rank: 2,
    name: "Sarah Johnson",
    username: "@sarahj",
    roi: "+41.0% ROI",
    return: "$96,696.002 return",
    followers: "1923 followers",
    winrate: "74.6% win rate",
    isFollowing: true,
  },
  {
    rank: 3,
    name: "Michael Rodriguez",
    username: "@mikerod",
    roi: "+39.3% ROI",
    return: "$94,408.784 return",
    followers: "3156 followers",
    winrate: "71.4% win rate",
    isFollowing: false,
  },
];

// ✅ Full Rankings Table Data
const fullTraders = [
  {
    rank: 1,
    name: "Alex Chen",
    username: "@alexchen",
    mentor: true,
    roi: "+46.8%",
    return: "$125,278.055",
    followers: 2847,
    winRate: "78.2%",
    streak: 12,
    following: true,
  },
  {
    rank: 2,
    name: "Sarah Johnson",
    username: "@sarahj",
    roi: "+41.4%",
    return: "$96,998.293",
    followers: 1923,
    winRate: "74.6%",
    streak: 8,
    following: true,
  },
  {
    rank: 3,
    name: "Michael Rodriguez",
    username: "@mikerod",
    mentor: true,
    roi: "+39.3%",
    return: "$94,391.702",
    followers: 3156,
    winRate: "71.4%",
    streak: 15,
    following: false,
  },
  {
    rank: 4,
    name: "Emma Wilson",
    username: "@emmaw",
    roi: "+34.7%",
    return: "$75,402.168",
    followers: 892,
    winRate: "69.4%",
    streak: 5,
    following: false,
  },
];

// ✅ Leaderboard Table Component
const LeaderboardTable = () => {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg text-white">
      <h2 className="text-xl font-bold mb-6">🏆 Full Rankings</h2>

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
            {fullTraders.map((t) => (
              <tr
                key={t.rank}
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

// ✅ Final Leaderboard Page
const Leaderboard = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Section 1 - Heading & Live Updates Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-100 flex items-center gap-2">
          Leaderboard
        </h1>
        <Button variant="outline" className="rounded-full">
          Live Updates
        </Button>
      </div>

      {/* Section 2 - Your Ranking Card */}
      <TraderBox className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 border-none shadow-xl text-white">
        <TraderBody className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Your Ranking</h2>
            <p className="opacity-80">trader@example.com</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">#247</p>
            <p className="text-green-400 font-medium">+12.5% ROI</p>
          </div>
        </TraderBody>
      </TraderBox>

      {/* Section 3 - Top Traders Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {traders.map((trader) => (
          <TraderCard key={trader.rank} trader={trader} />
        ))}
      </div>

      {/* Section 4 - Full Rankings Table */}
      <LeaderboardTable />
    </div>
  );
};

export default Leaderboard;
