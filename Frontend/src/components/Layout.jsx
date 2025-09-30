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
    <div className="flex h-screen bg-[#0a1128] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161829] p-6 flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <span className="text-2xl font-bold">
              📈 Trade<span className="text-green-400">vora</span>
              <span className="text-blue-400">Pro</span>
            </span>
          </div>
          <hr className="border-gray-700 mb-2" />
          <nav className="space-y-4 py-4">
            <Link
              to="/dashboard"
              className="block text-gray-300 py-1 px-1 hover:text-[#161829] hover:bg-white hover:rounded-md transition-all duration-300 ease-in-out"
            >
              📊 Dashboard
            </Link>
            <Link
              to="/market"
              className="block text-gray-300 py-1 px-1 hover:text-[#161829] hover:bg-white hover:rounded-md transition-all duration-300 ease-in-out"
            >
              📈 Market
            </Link>
            <Link
              to="/portfolio"
              className="block text-gray-300 py-1 px-1 hover:text-[#161829] hover:bg-white hover:rounded-md transition-all duration-300 ease-in-out"
            >
              💼 Portfolio
            </Link>
            <Link
              to="/strategies"
              className="block text-gray-300 py-1 px-1 hover:text-[#161829] hover:bg-white hover:rounded-md transition-all duration-300 ease-in-out"
            >
              📊 Strategies
            </Link>
            <Link
              to="/leaderboard"
              className="block text-gray-300 py-1 px-1 hover:text-[#161829] hover:bg-white hover:rounded-md transition-all duration-300 ease-in-out"
            >
              🏆 Leaderboard
            </Link>
            <Link
              to="/mentors"
              className="block text-gray-300 py-1 px-1 hover:text-[#161829] hover:bg-white hover:rounded-md transition-all duration-300 ease-in-out"
            >
              👨‍🏫 Mentors
            </Link>
          </nav>
        </div>
    
        <div className="mt-8 bg-[#1c1f33] p-4 rounded-lg">
          <p className="text-sm">trader@example.com</p>
          <p className="text-xs text-gray-400">User</p>
        </div>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="flex justify-between items-center px-6 md:px-10 py-6 bg-[#161829] shadow-md">
          <div className="flex items-center space-x-3 text-2xl font-bold">
            {title}
          </div>

          <div className="flex items-center space-x-6">
            <NotificationButton />
            <NotificationList />
            <WalletModel />

            <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-md font-medium hover:from-green-500 hover:to-blue-600 transition shadow-lg">
              <Link to="/">
                Home
              </Link>
            </button>
          </div>
        </nav>
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
     
  );
};

export default Layout;
