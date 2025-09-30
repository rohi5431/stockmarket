import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Portfolio from "./pages/Portfolio";
import Strategies from "./pages/Strategies";
import Leaderboard from "./pages/Leaderboard";
import Mentors from "./pages/Mentors";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Protect routes that require authentication
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// Redirect logged-in users away from login/signup
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return !token ? children : <Navigate to="/dashboard" />;
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        {/* Default route "/" */}
         <Route path="/" element={<Landing />} />

        {/* Protected Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="market"
            element={
              <PrivateRoute>
                <Market />
              </PrivateRoute>
            }
          />
          <Route
            path="portfolio"
            element={
              <PrivateRoute>
                <Portfolio />
              </PrivateRoute>
            }
          />
          <Route
            path="strategies"
            element={
              <PrivateRoute>
                <Strategies />
              </PrivateRoute>
            }
          />
          <Route
            path="leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />
          <Route
            path="mentors"
            element={
              <PrivateRoute>
                <Mentors />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Catch all - 404 */}
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
