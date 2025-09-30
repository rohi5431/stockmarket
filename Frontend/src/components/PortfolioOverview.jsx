import React, { useEffect, useState } from "react";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Filler } from "chart.js";
import { socket } from "../services/socket";
Chart.register(ArcElement, Tooltip, Legend);


const PortfolioOverview = () => {
  const [holdings, setHoldings] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        const initial = data.map((h) => ({
          symbol: h.symbol,
          name: h.name || h.symbol,
          quantity: h.quantity || h.qty,
          avgPrice: h.avgPrice,
          currentPrice: h.avgPrice,
          value: h.avgPrice * (h.quantity || h.qty),
          pnl: 0,
          change: 0,
          date: h.date ? h.date : new Date().toISOString(),
        }));
        setHoldings(initial);
      })
      .catch((err) => console.error("Error fetching holdings:", err));
  }, []);

  useEffect(() => {
    const handleMarketUpdate = (marketData) => {
      setHoldings((prev) =>
        prev.map((h) => {
          const market = marketData.find((m) => m.symbol === h.symbol);
          if(!market){
            return h;
          }
          const currentPrice = market.price;
          const pnl = (currentPrice - h.avgPrice) * h.quantity;
          const change = ((currentPrice - h.avgPrice) / h.avgPrice) * 100;
          const value = currentPrice * h.quantity;
          return { ...h, currentPrice, pnl, change, value };
        })
      );
    };

    const handleTradesUpdate = (trades) => {
      setHoldings((prev) => {
        const updated = [...prev];

        trades.forEach((trade) => {
          const idx = updated.findIndex((h) => h.symbol === trade.symbol);
          if(idx >= 0){
            const h = updated[idx];

            if(trade.type === "BUY"){
              const totalCost = h.avgPrice * h.quantity + trade.price * trade.qty;
              const newQty = h.quantity + trade.qty;
              const newAvg = totalCost / newQty;
              updated[idx] = { ...h, quantity: newQty, avgPrice: newAvg };
            } 
            else if(trade.type === "SELL"){
              const sellQty = Math.min(trade.qty, h.quantity);
              updated[idx] = { ...h, quantity: h.quantity - sellQty };
            }
          } 
          else{
            updated.push({
              symbol: trade.symbol,
              name: trade.symbol,
              quantity: trade.qty,
              avgPrice: trade.price,
              currentPrice: trade.price,
              value: trade.qty * trade.price,
              pnl: 0,
              change: 0,
              date: trade.date || new Date().toISOString(),
            });
          }
        });

        return updated.map((h) => ({
          ...h,
          value: h.currentPrice * h.quantity,
          pnl: (h.currentPrice - h.avgPrice) * h.quantity,
          change: ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100,
        }));
      });
    };

    socket.on("marketUpdate", handleMarketUpdate);
    socket.on("tradesUpdate", handleTradesUpdate);

    return () => {
      socket.off("marketUpdate", handleMarketUpdate);
      socket.off("tradesUpdate", handleTradesUpdate);
    };
  }, []);

  const data = {
    labels: holdings.map((h) => h.symbol),
    datasets: [
      {
        label: "Value",
        data: holdings.map((h) => h.value),
        backgroundColor: ["#1d4ed8", "#f97316", "#ef4444", "#10b981"],
        borderWidth: 2,
        borderColor: "#0f172a",
      },
    ],
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#cbd5e1",
          font: { size: 14, weight: "600" },
        },
      },
    },
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 p-6 bg-[#0c1224] rounded-xl shadow-lg text-gray-300">
      {/* Holdings Table */}
      <div className="bg-[#10192a] p-6 rounded-xl shadow-md overflow-x-auto">
        <h2 className="text-xl font-bold text-white mb-6">📘 My Holdings</h2>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#162033] text-gray-300">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Symbol</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Avg Price</th>
              <th className="px-4 py-3">Current Price</th>
              <th className="px-4 py-3">P&L</th>
              <th className="px-4 py-3 rounded-tr-lg">Value</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#1b2a40] transition duration-150 ease-in-out">
                <td className="px-4 py-3 font-bold text-white">
                  {item.symbol}
                  <div className="text-xs italic text-gray-500">{item.name}</div>
                </td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">${item.avgPrice.toFixed(2)}</td>
                <td className="px-4 py-3">${item.currentPrice.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.pnl >= 0 ? "bg-green-800 text-green-300" : "bg-red-800 text-red-300"
                    }`}
                  >
                    {item.pnl >= 0 ? <HiTrendingUp className="mr-1" /> : <HiTrendingDown className="mr-1" />}
                    {item.pnl >= 0 ? "+" : "-"}${Math.abs(item.pnl).toFixed(2)} (
                    {item.change >= 0 ? "+" : "-"}
                    {Math.abs(item.change).toFixed(2)}%)
                  </div>
                </td>
                <td className="px-4 py-3 text-white font-semibold">${item.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Portfolio Allocation */}
      <div className="bg-[#10192a] p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-white mb-6">📈 Allocation Breakdown</h2>
        {holdings.length > 0 ? <Doughnut data={data} options={options} /> : <p className="text-gray-400">Loading chart...</p>}
      </div>
    </div>
  );
};

export default PortfolioOverview;
