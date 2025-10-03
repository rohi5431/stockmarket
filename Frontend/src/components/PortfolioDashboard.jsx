import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import { socket } from "../services/socket";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PortfolioDashboard = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/trades")
      .then((res) => res.json())
      .then((data) =>
        setTrades(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
      );
  }, []);

  useEffect(() => {
    socket.on("tradeUpdate", (newTrade) => {
      setTrades((prev) => [newTrade, ...prev]);
    });

    return () => {
      socket.off("tradeUpdate");
    };
  }, []);

  const data = {
    labels: trades.map((tm) =>
      tm.date ? new Date(tm.date).toLocaleString() : new Date().toLocaleString()
    ),
    datasets: [
      {
        label: "Portfolio Value",
        data: trades.map((t) => t.qty * t.price),
        fill: true,
        backgroundColor: "rgba(79, 70, 229, 0.1)", // light indigo fill
        borderColor: "rgba(79, 70, 229, 1)", // indigo border
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const formatDate = (date) => {
    if (!date) {
      return new Date().toLocaleString();
    }
    try {
      return new Date(date.replace(" ", "T")).toLocaleString();
    } catch {
      return new Date().toLocaleString();
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#374151" } }, // gray-700
    },
    scales: {
      x: { ticks: { color: "#374151" }, grid: { color: "#e5e7eb" } },
      y: { ticks: { color: "#374151" }, grid: { color: "#e5e7eb" } },
    },
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl shadow-md space-y-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Performance Chart */}
        <section className="flex-1 bg-white rounded-lg p-6 shadow hover:shadow-lg transition">
          <h2 className="text-gray-800 text-xl font-semibold mb-4">
            📊 Portfolio Performance
          </h2>
          <Line data={data} options={options} />
        </section>

        {/* Recent Trades */}
        <section className="w-full max-w-md bg-white rounded-lg p-6 shadow hover:shadow-lg transition">
          <h2 className="text-gray-800 text-xl font-semibold mb-5">
            🔄 Recent Trades
          </h2>
          <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
            {trades.map((trade, i) => (
              <li
                key={i}
                className="flex justify-between items-center py-3 hover:bg-gray-100 px-2 rounded-md transition"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`p-2 rounded-full ${
                      trade.type === "BUY"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {trade.type === "BUY" ? <HiArrowSmUp /> : <HiArrowSmDown />}
                  </span>
                  <div>
                    <p className="text-gray-800 font-bold">{trade.symbol}</p>
                    <p className="text-gray-500 text-xs">
                      {trade.type} {trade.qty} @ ${trade.price}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 font-semibold">
                    ${(trade.qty * trade.price).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatDate(trade.date)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Trade History */}
      <section className="bg-white rounded-lg p-6 shadow-inner">
        <h2 className="text-gray-800 text-xl font-semibold mb-6">
          📑 Trade History
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                {[
                  "Date & Time",
                  "Symbol",
                  "Type",
                  "Quantity",
                  "Price",
                  "Total",
                ].map((h) => (
                  <th key={h} className="py-3 px-4 font-semibold border">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-100 transition border-b border-gray-200"
                >
                  <td className="py-3 px-4 border">{formatDate(trade.date)}</td>
                  <td className="py-3 px-4 font-bold text-gray-800 border">
                    {trade.symbol}
                  </td>
                  <td className="py-3 px-4 border">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        trade.type === "BUY"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 border">{trade.qty}</td>
                  <td className="py-3 px-4 border">${trade.price}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800 border">
                    ${(trade.qty * trade.price).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PortfolioDashboard;
