import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { TraderBox, TraderBody } from "../components/ui/Card";
import AuthContext, { AuthProvider } from "../context/AuthContext.jsx";

const TraderCard = ({ trader }) => {
  const { token } = useContext(AuthContext);
  const [isFollowing, setIsFollowing] = useState(trader.isFollowing);
  const [followersCount, setFollowersCount] = useState(trader.followers);

  const toggleFollow = async () => {
    if(!token){
      alert("Please login to follow traders");
      return;
    }

    try{
      const url = `http://localhost:5000/api/strategies/${isFollowing ? "unfollow" : "follow"}/${trader.symbol}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if(!res.ok)
        throw new Error(data.error || "Error updating follow status");

      setIsFollowing(!isFollowing);
      setFollowersCount((count) => (isFollowing ? count - 1 : count + 1));
    } 
    catch(err){
      alert(err.message);
    }
  };

  return (
    <TraderBox className="relative w-full h-[26rem] bg-gray-900 text-white rounded-2xl shadow-lg overflow-hidden">
      <div className="absolute top-4 left-4 text-yellow-400 text-2xl font-extrabold">
        {trader.rank ? `#${trader.rank}` : ""}
      </div>

      <TraderBody className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-700 text-2xl font-bold">
          {trader.name.charAt(0)}
        </div>

        <h3 className="text-xl font-semibold">{trader.name}</h3>
        <p className="text-sm text-gray-400">{trader.symbol}</p>

        <p className="text-green-400 font-bold text-lg">{trader.roi}</p>
        <p className="text-sm text-gray-300">{trader.return}</p>
        <p className="text-sm text-gray-400">
          {followersCount} followers • {trader.winRate} win rate
        </p>
        <Button
          className={`rounded-full px-6 py-2 mt-4 transition ${
            isFollowing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={toggleFollow}>
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </TraderBody>
    </TraderBox>
  );
};

export default TraderCard;
