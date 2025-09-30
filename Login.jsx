import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-8">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-2xl">📈</span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="text-gray-400 mt-1">Login to continue your trading journey</p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email */}
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400"
            />
            <span className="absolute right-3 top-9 text-gray-400">📧</span>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full pr-10 px-4 py-3 rounded-lg bg-white/5 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 mt-4 right-3 flex items-center text-gray-400"
            >
              {showPassword ? "🔓" : "🔒"}
            </button>
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400">
              <input type="checkbox" className="w-4 h-4 rounded-md border-gray-500" />
              Remember me
            </label>
            <a href="#" className="text-blue-400 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold shadow-lg hover:from-green-500 hover:to-blue-600 transition"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Social Login */}
        <div className="flex gap-4">
          <button className="flex-1 py-3 bg-white text-gray-700 rounded-lg font-medium shadow hover:bg-gray-100 transition">
            Google
          </button>
          <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition">
            Facebook
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-green-400 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

