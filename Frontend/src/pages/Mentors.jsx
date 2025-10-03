import React, { useState, useEffect } from "react";
import { Search, Users, Filter, BarChart2, Star, Calendar, Eye } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { socket } from "../services/socket";

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
  <div className="bg-white/80 rounded-2xl p-5 shadow-sm border border-gray-200 transition hover:shadow-md hover:bg-gray-50">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
          {mentor.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
          <p className="text-sm text-gray-500">{mentor.username}</p>
          <div className="flex gap-3 text-xs text-gray-500 mt-1">
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
        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
          mentor.following
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        }`}
      >
        {mentor.following ? "Following" : "Follow"}
      </button>
    </div>

    <p className="text-sm mb-3 text-gray-700">{mentor.bio}</p>

    <div className="flex flex-wrap gap-2 mb-3">
      {mentor.tags.map((tag, idx) => (
        <span
          key={idx}
          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
        >
          {tag}
        </span>
      ))}
    </div>

    <div className="grid grid-cols-4 text-center mb-3">
      <div>
        <p className="text-green-600 font-semibold">{mentor.roi}%</p>
        <p className="text-xs text-gray-500">ROI</p>
      </div>
      <div>
        <p className="font-semibold">{mentor.winRate}%</p>
        <p className="text-xs text-gray-500">Win Rate</p>
      </div>
      <div>
        <p className="font-semibold">{mentor.trades}</p>
        <p className="text-xs text-gray-500">Trades</p>
      </div>
      <div>
        <p className="font-semibold">{mentor.sharpe}</p>
        <p className="text-xs text-gray-500">Sharpe</p>
      </div>
    </div>

    <div className="w-full h-20 mb-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mentor.chartData}>
          <XAxis dataKey="day" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{ backgroundColor: "#f3f4f6", border: "none" }}
            labelStyle={{ color: "#1f2937" }}
          />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="flex gap-2">
      <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 w-full justify-center text-sm hover:bg-gray-200 transition">
        <Eye className="w-4 h-4" /> View Portfolio
      </button>
      <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 w-full justify-center text-sm hover:bg-blue-100 transition">
        <BarChart2 className="w-4 h-4" /> Copy Trades
      </button>
    </div>
  </div>
);

const Mentors = () => {
  const [mentors, setMentors] = useState(dummyMentors);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Highest ROI");

  const toggleFollow = (username) => {
    setMentors((prev) =>
      prev.map((m) =>
        m.username === username ? { ...m, following: !m.following } : m
      )
    );
  };

  useEffect(() => {
    socket.on("mentorsUpdate", (updatedMentors) => {
      setMentors((prev) =>
        prev.map((m) => {
          const update = updatedMentors.find((u) => u.username === m.username);
          if (!update) return m;
          const newChart = [...m.chartData.slice(-9), { day: m.chartData.length + 1, value: update.currentValue }];
          return { ...m, ...update, chartData: newChart };
        })
      );
    });
    return () => socket.off("mentorsUpdate");
  }, []);

  const filtered = mentors.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.username.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  const sorted = filtered.sort((a, b) => {
    if (sortBy === "Highest ROI") return parseFloat(b.roi.replace("+", "")) - parseFloat(a.roi.replace("+", ""));
    if (sortBy === "Most Followers") return parseInt(b.followers.replace(/,/g, "")) - parseInt(a.followers.replace(/,/g, ""));
    if (sortBy === "Win Rate") return parseFloat(b.winRate) - parseFloat(a.winRate);
    return 0;
  });

  const avgROI = (mentors.reduce((sum, m) => sum + parseFloat(m.roi.replace("+", "")), 0) / mentors.length).toFixed(1);
  const followedMentors = mentors.filter((m) => m.following);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mentors</h2>
            <p className="text-sm text-gray-600">Learn from their strategies.</p>
          </div>
          <button className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full border border-gray-300 transition">
            <Users className="w-4 h-4 text-gray-700" /> {mentors.length} Active
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2 w-full">
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search mentors by name, username, or expertise..."
              className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-gray-100 border border-gray-300 text-sm px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
            >
              <option>Highest ROI</option>
              <option>Most Followers</option>
              <option>Win Rate</option>
              <option>Newest</option>
            </select>
            <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {sorted.map((mentor, i) => (
          <MentorCard key={i} mentor={mentor} toggleFollow={toggleFollow} />
        ))}
      </div>

      {/* Followed Mentors */}
      {followedMentors.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Followed Mentors
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {followedMentors.map((mentor, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-white/80 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700">
                    {mentor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{mentor.name}</p>
                    <p className="text-sm text-green-600">{parseFloat(mentor.roi)}% ROI</p>
                  </div>
                </div>
                <BarChart2 className="w-5 h-5 text-gray-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl shadow-sm hover:bg-blue-100 transition">
          <Users className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm text-blue-700">Total Mentors</p>
            <p className="font-semibold text-blue-800">{mentors.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl shadow-sm hover:bg-green-100 transition">
          <BarChart2 className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-green-700">Avg ROI (Followed)</p>
            <p className="font-semibold text-green-800">{avgROI}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-2xl shadow-sm hover:bg-yellow-100 transition">
          <Star className="w-5 h-5 text-yellow-500" />
          <div>
            <p className="text-sm text-yellow-700">Following</p>
            <p className="font-semibold text-yellow-800">{followedMentors.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
