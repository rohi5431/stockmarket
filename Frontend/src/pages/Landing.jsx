import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import ImageShowcase from "../components/ImageShower";
import MarketTick from "../components/MarketTick";

const Landing = () => {
  const navigate = useNavigate();

  const handleStartTrading = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="bg-[#faf7f0] min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center md:px-10 py-6 bg-[#d1f5e0] shadow-lg sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl">📈</span>
          </div>
          <span className="font-bold text-xl text-gray-900">
            <span className="text-blue-500">Trade</span>
            <span className="text-green-500">vora</span>
            <span className="text-gray-900">Pro</span>
          </span>
        </div>

        {/* Menu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => scrollToSection("features")}
            className="text-gray-800 px-3 py-2 rounded-md font-medium bg-[#fdfcf7] hover:bg-blue-200 transition"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("live-news")}
            className="text-gray-800 px-3 py-2 rounded-md font-medium bg-[#fdfcf7] hover:bg-green-200 transition"
          >
            Live News
          </button>

          <button
            onClick={() => scrollToSection("contact")}
            className="text-gray-800 px-3 py-2 rounded-md font-medium bg-[#fdfcf7] hover:bg-red-200 transition"
          >
            Contact
          </button>

          <Link
            to="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
          >
            Login
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:from-green-500 hover:to-blue-600 transition shadow-lg"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
        <img
          src="/image.jpg" // <-- Replace with your image path
          alt="Market background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-500 leading-tight">
            Live market pulse at{" "}
            <span className="text-green-500">your fingertips</span>
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl mt-6 mb-8">
            Master the markets with virtual trading, learn from expert mentors,
            and compete on global leaderboards — all powered by real-time stock
            and crypto data.
          </p>
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleStartTrading}
              className="bg-blue-500 px-6 py-3 text-white rounded-lg font-semibold hover:from-green-500 hover:to-blue-600 transition"
            >
              Start Trading Now
            </button>
            <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition">
              Watch Demo
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section
        id="features"
        className="relative bg-[#fdfcf7] py-28 text-center text-gray-800"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900">
            Unlock Your Potential to{" "}
            <span className="text-green-600">Trade Smarter</span>
          </h2>
          <p className="max-w-3xl mx-auto mb-12 text-gray-600 text-lg">
            Experience cutting-edge technology and expert insights designed to
            elevate your trading game and maximize your profits.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Real-time Trading",
                desc: "Trade with live market data from stocks and crypto markets with zero latency.",
              },
              {
                icon: "👥",
                title: "Copy Expert Mentors",
                desc: "Follow and copy trades from top-performing mentors to accelerate your learning.",
              },
              {
                icon: "🏆",
                title: "Competitive Leaderboards",
                desc: "Compete with traders worldwide and climb the rankings with your performance.",
              },
              {
                icon: "🛡️",
                title: "Risk-Free Environment",
                desc: "Practice with virtual money while learning real trading strategies.",
              },
              {
                icon: "⚡",
                title: "Advanced Analytics",
                desc: "Analyze your performance with detailed charts and strategy backtesting.",
              },
              {
                icon: "📈",
                title: "Portfolio Management",
                desc: "Track your holdings, P&L, and trading history with comprehensive tools.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-2xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h4 className="font-bold mb-4 text-2xl text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-[15px]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ImageShowcase />
      <MarketTick />

      {/* Contact Section */}
      <section
        id="contact"
        className="bg-gray-100 py-28 text-center text-gray-800"
      >
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-500">
            Contact Us
          </h2>
          <p className="text-lg mb-4">
            Have questions or need support? Reach out to our team at{" "}
            <a
              href="mailto:support@tradevora.com"
              className="text-green-600 underline"
            >
              support@tradevora.com
            </a>
          </p>
          <p className="text-gray-600">We respond within 24 hours!</p>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Landing;
