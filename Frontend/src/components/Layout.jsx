import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DepositMoney from "./DepositMoney";  
import WalletModel from "./WalletModel";
import NotificationButton from "./NotificationButton";
import NotificationList from "./NotificationList";

const Layout = () => {
  const location = useLocation();

  const features = {
    "/dashboard": "Dashboard",
    "/market": "Market",
    "/portfolio": "Portfolio",
    "/strategies": "Strategies",
    "/leaderboard": "Leaderboard",
    "/mentors": "Mentors",
    "/login": "Login",
    "/register": "Register",
    "/": "Home",
  };

  const title = features[location.pathname] || "Page";

  return (
    <div className="flex h-screen bg-gray-50text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-50 to-indigo-100 shadow-lg p-6 flex flex-col justify-between border-r border-indigo-300">
        <div>
          <div className="mb-6">
            <span className="text-2xl font-bold">
              📈 Trade<span className="text-green-500">vora</span>
              <span className="text-blue-500">Pro</span>
            </span>
          </div>
          <hr className="border-indigo-300 mb-4" />
          <nav className="space-y-4 py-4">
            {[
              { to: "/dashboard", label: "📊 Dashboard" },
              { to: "/market", label: "📈 Market" },
              { to: "/portfolio", label: "💼 Portfolio" },
              { to: "/strategies", label: "📊 Strategies" },
              { to: "/leaderboard", label: "🏆 Leaderboard" },
              { to: "/mentors", label: "👨‍🏫 Mentors" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-2 px-3 rounded-md transition-all duration-300 ease-in-out ${
                  location.pathname === link.to
                    ? "bg-green-200 text-green-700 font-semibold"
                    : "text-indigo-700 hover:bg-green-200 hover:text-green-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 bg-indigo-100 p-4 rounded-lg text-center shadow-md">
          <p className="text-sm font-semibold text-indigo-800">trader@example.com</p>
          <p className="text-xs text-indigo-500">User</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="flex justify-between items-center px-6 md:px-10 py-4 bg-gradient-to-r from-pink-50 to-pink-100 shadow-md border-b border-pink-300">
          <div className="flex items-center space-x-3 text-2xl font-bold text-pink-900">
            {title}
          </div>

          <div className="flex items-center space-x-4">
            <NotificationButton />
            <NotificationList />
            <WalletModel />

            <Link
              to="/"
              className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-600 transition shadow-md"
            >
              Home
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gradient-to-b from-gray-50 to-gray-100 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
