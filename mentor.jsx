import React from "react";
import { Search, Users, Filter, Eye, BarChart2, Calendar, Target, Star  } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mentors = [
  {
    name: "Alex Chen",
    username: "@alexchen",
    followers: "2,847",
    experience: 8,
    bio: "Quant trader with 8+ years in algorithmic trading. Specializes in momentum and risk management.",
    tags: ["Momentum", "Risk Mgmt", "Algo Trading"],
    roi: "+45.8%",
    winRate: "78.2%",
    trades: 234,
    sharpe: 2.1,
    following: true,
    chartData: [
      { day: 1, value: 100 },
      { day: 2, value: 120 },
      { day: 3, value: 90 },
      { day: 4, value: 150 },
      { day: 5, value: 170 },
    ],
  },
  {
    name: "Michael Rodriguez",
    username: "@mikerod",
    followers: "1,923",
    experience: 5,
    bio: "Crypto & DeFi specialist. Focused on sustainable strategies in volatile markets.",
    tags: ["Crypto", "DeFi", "Technical Analysis"],
    roi: "+42.3%",
    winRate: "69.8%",
    trades: 189,
    sharpe: 1.6,
    following: true,
    chartData: [
      { day: 1, value: 80 },
      { day: 2, value: 95 },
      { day: 3, value: 110 },
      { day: 4, value: 105 },
      { day: 5, value: 130 },
    ],
  },
];

const mentorsStats = [
  {
    title: "Total Mentors",
    value: "6",
    subtext: "Active expert traders",
    icon: <Users className="w-6 h-6 text-white" />,
    border: "border-indigo-500",
  },
  {
    title: "Avg ROI",
    value: "+37.1%",
    subtext: "Mentor average",
    icon: <BarChart2 className="w-6 h-6 text-white" />,
    border: "border-green-500",
  },
  {
    title: "Avg Win Rate",
    value: "71.1%",
    subtext: "Success rate",
    icon: <Target className="w-6 h-6 text-white" />,
    border: "border-pink-500",
  },
  {
    title: "Following",
    value: "2",
    subtext: "Mentors you follow",
    icon: <Star className="w-6 h-6 text-white" />,
    border: "border-yellow-400",
  },
];

const followedMentors = [
  {
    name: "Alex Chen",
    roi: "+45.8% ROI",
  },
  {
    name: "Michael Rodriguez",
    roi: "+42.3% ROI",
  },
];

const MentorsStats = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mentorsStats.map((stat, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-5 rounded-xl border-l-4 ${stat.border} bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg`}
          >
            <div className="p-3 bg-gray-700 rounded-full">{stat.icon}</div>
            <div>
              <h4 className="text-sm text-gray-300">{stat.title}</h4>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Followed Mentors */}
      <div className="bg-[#111827] rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
          <Star className="w-5 h-5" /> Your Followed Mentors
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {followedMentors.map((mentor, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
                  {mentor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-white">{mentor.name}</p>
                  <p className="text-green-400 text-sm">{mentor.roi}</p>
                </div>
              </div>
              <div className="p-2 bg-gray-700 rounded-lg text-white">
                <BarChart2 className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const MentorCard = ({ mentor }) => {
  return (
    <div className="bg-gradient-to-br from-gray-800/80 via-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 text-white border border-gray-700 hover:border-indigo-500 transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-xl font-bold">
            {mentor.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold">{mentor.name}</h3>
            <p className="text-sm text-gray-400">{mentor.username}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {mentor.followers}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {mentor.experience} yrs
              </span>
            </div>
          </div>
        </div>

        {/* Follow Button */}
        <button className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-sm font-medium shadow-md">
          {mentor.following ? "Following" : "Follow"}
        </button>
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-300 leading-relaxed mb-3">{mentor.bio}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mentor.tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-indigo-900/40 border border-indigo-700 rounded-full text-xs text-indigo-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 text-center mb-4">
        <div>
          <p className="text-green-400 font-bold">{mentor.roi}</p>
          <p className="text-xs text-gray-400">ROI</p>
        </div>
        <div>
          <p className="font-bold">{mentor.winRate}</p>
          <p className="text-xs text-gray-400">Win Rate</p>
        </div>
        <div>
          <p className="font-bold">{mentor.trades}</p>
          <p className="text-xs text-gray-400">Trades</p>
        </div>
        <div>
          <p className="font-bold">{mentor.sharpe}</p>
          <p className="text-xs text-gray-400">Sharpe</p>
        </div>
      </div>

      {/* ✅ Real Chart */}
      <div className="w-full h-20 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mentor.chartData}>
            <XAxis dataKey="day" hide />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
              labelStyle={{ color: "white" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/70 hover:bg-gray-700 transition text-sm w-full justify-center">
          <Eye className="w-4 h-4" /> View Portfolio
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition text-sm w-full justify-center">
          <BarChart2 className="w-4 h-4" /> Copy Trades
        </button>
      </div>
    </div>
  );
};

const Mentors = () => {
  return (
    <>
    <div className="bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800 rounded-2xl p-6 shadow-lg text-white space-y-4">
      {/* Top Row - Title & Active Mentors */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold">🌟 Elite Mentors</h2>
          <p className="text-sm text-gray-200 opacity-80">
            Discover top-performing traders and learn from their strategies.
          </p>
        </div>
        <button className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 transition">
          <Users className="w-4 h-4" /> 6 Active
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        {/* Search Box */}
        <div className="flex items-center bg-white/10 rounded-xl px-4 py-2 w-full">
          <Search className="w-4 h-4 text-gray-300 mr-2" />
          <input
            type="text"
            placeholder="Search mentors by name, username, or expertise..."
            className="bg-transparent outline-none text-sm text-white placeholder-gray-300 w-full"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <select className="appearance-none bg-indigo-900/70 border border-white/20 text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer">
            <option>Highest ROI</option>
            <option>Most Followers</option>
            <option>Win Rate</option>
            <option>Newest</option>
          </select>
          <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
        </div>
      </div>
      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mentors.map((m, i) => (
        <MentorCard key={i} mentor={m} />
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mentors.map((m, i) => (
        <MentorCard key={i} mentor={m} />
      ))}
    </div>
    </div>
    <MentorsStats />
    </>
  );
};

export default Mentors;