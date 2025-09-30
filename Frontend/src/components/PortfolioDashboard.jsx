import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,Filler }
from "chart.js";
import { HiArrowSmUp, HiArrowSmDown } from "react-icons/hi";
import {socket} from "../services/socket";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);


const PortfolioDashboard = () => {
  const [trades, setTrades] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/trades")
      .then((res) => res.json())
      .then((data) => setTrades(data.sort((a, b) => new Date(b.date) - new Date(a.date))));
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
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };
  const formatDate = (date) => {
      if(!date){
        return new Date().toLocaleString(); 
      }
      try{
        return new Date(date.replace(' ', 'T')).toLocaleString(); 
      } 
      catch{
        return new Date().toLocaleString(); 
      }
  };


  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "white" } },
    },
    scales: {
      x: { ticks: { color: "white" }, grid: { color: "#2c3e50" } },
      y: { ticks: { color: "white" }, grid: { color: "#2c3e50" } },
    },
  };

  return (
    <div className="bg-[#0f121c] p-6 rounded-xl shadow-lg space-y-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Performance Chart */}
        <section className="flex-1 bg-gradient-to-br from-[#1e293b] to-[#0d1725] rounded-lg p-6 shadow-md">
          <h2 className="text-white text-xl font-semibold mb-4">Portfolio Performance</h2>
          <Line data={data} options={options} />
        </section>

        {/* Recent Trades */}
        <section className="w-full max-w-md bg-[#1f293b] rounded-lg p-6 shadow-lg">
          <h2 className="text-white text-xl font-semibold mb-5">Recent Trades</h2>
          <ul className="divide-y divide-gray-700 max-h-80 overflow-y-auto">
            {trades.map((trade, i) => (
              <li key={i} className="flex justify-between items-center py-3 hover:bg-[#28354b] px-2 rounded-md">
                <div className="flex items-center space-x-3">
                  <span className={`p-2 rounded-full ${trade.type === "BUY" ? "bg-green-600 text-green-200" : "bg-red-600 text-red-200"}`}>
                    {trade.type === "BUY" ? <HiArrowSmUp /> : <HiArrowSmDown />}
                  </span>
                  <div>
                    <p className="text-white font-bold">{trade.symbol}</p>
                    <p className="text-gray-400 text-xs">{trade.type} {trade.qty} @ ${trade.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${(trade.qty * trade.price).toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">{formatDate(trade.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Trade History */}
      <section className="bg-[#1b2233] rounded-lg p-6 shadow-inner">
        <h2 className="text-white text-xl font-semibold mb-6">Trade History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-300 text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {["Date & Time", "Symbol", "Type", "Quantity", "Price", "Total"].map((h) => (
                  <th key={h} className="py-3 px-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, i) => (
                <tr key={i} className="border-b border-gray-700 hover:bg-[#28354b] transition">
                  <td className="py-3 px-4">{formatDate(trade.date)}</td>
                  <td className="py-3 px-4 font-bold text-white">{trade.symbol}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${trade.type === "BUY" ? "bg-gray-600" : "bg-red-600"} text-white`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">{trade.qty}</td>
                  <td className="py-3 px-4">${trade.price}</td>
                  <td className="py-3 px-4 font-semibold">${(trade.qty * trade.price).toLocaleString()}</td>
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
