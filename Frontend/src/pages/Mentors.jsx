import React, { useState, useEffect } from "react";
import { Search, Users, Filter, BarChart2, Star, Calendar, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { socket } from "../services/socket"; // Your WebSocket service

const dummyMentors = [
  {
    name: "Alex Chen",
    username: "@alexchen",
    followers: "2,847",
    experience: 8,
    bio: "Quant trader with 8+ years in algorithmic trading.",
    tags: ["Momentum", "Risk Mgmt", "Algo Trading"],
    roi: "+45.8",
    winRate: "78.2",
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
    bio: "Crypto & DeFi specialist.",
    tags: ["Crypto", "DeFi", "Technical Analysis"],
    roi: "+42.3",
    winRate: "69.8",
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

// Mentor Card Component
const MentorCard = ({ mentor, toggleFollow }) => (
  <div className="bg-white/80 dark:bg-gray-700 rounded-2xl p-5 shadow-md text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 transition hover:shadow-lg">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-blue-600 flex items-center justify-center font-bold text-gray-800 dark:text-gray-100">
          {mentor.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold">{mentor.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">{mentor.username}</p>
          <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {mentor.followers}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {mentor.experience} yrs
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={() => toggleFollow(mentor.username)}
        className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-700 text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-600 transition"
      >
        {mentor.following ? "Following" : "Follow"}
      </button>
    </div>

    <p className="text-sm mb-3">{mentor.bio}</p>

    <div className="flex flex-wrap gap-2 mb-3">
      {mentor.tags.map((tag, idx) => (
        <span key={idx} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs">
          {tag}
        </span>
      ))}
    </div>

    <div className="grid grid-cols-4 text-center mb-3">
      <div><p className="text-green-600 dark:text-green-300 font-semibold">{mentor.roi}%</p><p className="text-xs text-gray-500 dark:text-gray-400">ROI</p></div>
      <div><p className="font-semibold">{mentor.winRate}%</p><p className="text-xs text-gray-500 dark:text-gray-400">Win Rate</p></div>
      <div><p className="font-semibold">{mentor.trades}</p><p className="text-xs text-gray-500 dark:text-gray-400">Trades</p></div>
      <div><p className="font-semibold">{mentor.sharpe}</p><p className="text-xs text-gray-500 dark:text-gray-400">Sharpe</p></div>
    </div>

    <div className="w-full h-20 mb-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mentor.chartData}>
          <XAxis dataKey="day" hide />
          <YAxis hide />
          <Tooltip contentStyle={{ backgroundColor: "#f3f4f6", border: "none" }} labelStyle={{ color: "#1f2937" }} />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="flex gap-2">
      <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-600 w-full justify-center text-sm hover:bg-gray-200 dark:hover:bg-gray-500 transition">
        <Eye className="w-4 h-4" /> View Portfolio
      </button>
      <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-700 w-full justify-center text-sm hover:bg-blue-200 dark:hover:bg-blue-600 transition">
        <BarChart2 className="w-4 h-4" /> Copy Trades
      </button>
    </div>
  </div>
);

const Mentors = () => {
  const [mentors, setMentors] = useState(dummyMentors);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Highest ROI");

  // Toggle follow/unfollow
  const toggleFollow = (username) => {
    setMentors(prev => prev.map(m => m.username === username ? { ...m, following: !m.following } : m));
  };

  // WebSocket subscription for live updates
  useEffect(() => {
    socket.on("mentorsUpdate", (updatedMentors) => {
      setMentors(prev =>
        prev.map(m => {
          const update = updatedMentors.find(u => u.username === m.username);
          if (!update) return m;
          const newChart = [...m.chartData.slice(-9), { day: m.chartData.length + 1, value: update.currentValue }];
          return { ...m, ...update, chartData: newChart };
        })
      );
    });

    return () => socket.off("mentorsUpdate");
  }, []);

  const filtered = mentors.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.username.toLowerCase().includes(search.toLowerCase()) ||
    m.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const sorted = filtered.sort((a, b) => {
    if (sortBy === "Highest ROI") return parseFloat(b.roi) - parseFloat(a.roi);
    if (sortBy === "Most Followers") return parseInt(b.followers.replace(/,/g, "")) - parseInt(a.followers.replace(/,/g, ""));
    if (sortBy === "Win Rate") return parseFloat(b.winRate) - parseFloat(a.winRate);
    return 0;
  });

  const avgROI = (mentors.reduce((sum, m) => sum + parseFloat(m.roi), 0) / mentors.length).toFixed(1);
  const followedMentors = mentors.filter(m => m.following);

  return (
    <div className="space-y-6 p-6">
      {/* Top Header */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-blue-600">Mentors</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Learn from their strategies.
            </p>
          </div>
          <button className="flex items-center gap-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 transition">
            <Users className="w-4 h-4 text-gray-700 dark:text-white" /> {mentors.length} Active
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center bg-white/80 dark:bg-gray-700 rounded-xl px-4 py-2 w-full">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-300 mr-2" />
            <input
              type="text"
              placeholder="Search mentors by name, username, or expertise..."
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-300 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
            >
              <option>Highest ROI</option>
              <option>Most Followers</option>
              <option>Win Rate</option>
              <option>Newest</option>
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mentor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {sorted.map((mentor, i) => (
          <MentorCard key={i} mentor={mentor} toggleFollow={toggleFollow} />
        ))}
      </div>

      {/* Followed Mentors Section */}
      <div className="space-y-3 mt-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-blue-600 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-300" /> Followed Mentors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {followedMentors.map((mentor, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-blue-600 flex items-center justify-center font-semibold text-gray-800 dark:text-gray-100">
                  {mentor.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{mentor.name}</p>
                  <p className="text-sm text-green-600 dark:text-green-300">{mentor.roi}% ROI</p>
                </div>
              </div>
              <BarChart2 className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900 rounded-2xl shadow-sm">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          <div>
            <p className="text-sm text-blue-700 dark:text-blue-200">Total Mentors</p>
            <p className="font-semibold text-blue-800 dark:text-blue-100">{mentors.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900 rounded-2xl shadow-sm">
          <BarChart2 className="w-5 h-5 text-green-600 dark:text-green-300" />
          <div>
            <p className="text-sm text-green-700 dark:text-green-200">Avg ROI (Followed)</p>
            <p className="font-semibold text-green-800 dark:text-green-100">{avgROI}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-2xl shadow-sm">
          <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-300" />
          <div>
            <p className="text-sm text-yellow-700 dark:text-yellow-200">Following</p>
            <p className="font-semibold text-yellow-800 dark:text-yellow-100">{followedMentors.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
