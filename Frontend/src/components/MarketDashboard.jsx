import React from "react";
import { Card, CardContents, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", price: 120 },
  { name: "Tue", price: 200 },
  { name: "Wed", price: 150 },
  { name: "Thu", price: 220 },
  { name: "Fri", price: 180 },
  { name: "Sat", price: 250 },
  { name: "Sun", price: 300 },
];

const MarketDashboard = () => {
  return (
    <div className="grid gap-4 md:grid-cols-1 p-4">
      {/* Live Market Overview */}
      <Card className="md:col-span-2 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Live Market Overview</CardTitle>
        </CardHeader>
        <CardContents>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContents>
      </Card>

      {/* Balance Card */}
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Balance</CardTitle>
        </CardHeader>
        <CardContents>
          <p className="text-2xl font-semibold">$12,540.50</p>
          <p className="text-green-500 text-sm">+3.25% Today</p>
        </CardContents>
      </Card>

      {/* Watchlist */}
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Watchlist</CardTitle>
        </CardHeader>
        <CardContents>
          <ul className="space-y-2">
            <li className="flex justify-between"><span>BTC</span> <span>$45,320</span></li>
            <li className="flex justify-between"><span>ETH</span> <span>$3,250</span></li>
            <li className="flex justify-between"><span>TSLA</span> <span>$720</span></li>
          </ul>
        </CardContents>
      </Card>

      {/* Top Movers */}
      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Top Movers</CardTitle>
        </CardHeader>
        <CardContents>
          <ul className="space-y-2">
            <li className="flex justify-between text-green-500"><span>AAPL</span> <span>+5.2%</span></li>
            <li className="flex justify-between text-red-500"><span>AMZN</span> <span>-2.1%</span></li>
            <li className="flex justify-between text-green-500"><span>MSFT</span> <span>+3.8%</span></li>
          </ul>
        </CardContents>
      </Card>

      {/* Trade Panel */}
      <Card className="md:col-span-3 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Trade Panel</CardTitle>
        </CardHeader>
        <CardContents className="flex flex-col md:flex-row gap-4">
          <input type="text" placeholder="Enter Stock / Crypto" className="border rounded-lg p-2 w-full md:w-1/3" />
          <input type="number" placeholder="Amount" className="border rounded-lg p-2 w-full md:w-1/3" />
          <div className="flex gap-2">
            <Button className="bg-green-500 hover:bg-green-600">Buy</Button>
            <Button className="bg-red-500 hover:bg-red-600">Sell</Button>
          </div>
        </CardContents>
      </Card>
    </div>
  );
}

export default MarketDashboard;