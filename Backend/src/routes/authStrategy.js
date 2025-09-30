const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// Sample strategies data (you can replace with real API calls)
let strategies = [
  { symbol: "AAPL", name: "Apple", roi: "+5.2%", return: "$1200", followers: 100, winRate: "75%" },
  { symbol: "TSLA", name: "Tesla", roi: "+12.3%", return: "$2100", followers: 150, winRate: "80%" },
];

// Get strategies with user following info
router.get("/api/get_strategies", authMiddleware, async (req, res) => {
  try{
    const user = await User.findById(req.user.id);
    if(!user) 
      return res.status(404).json({ message: "User not found" });

    // Add isFollowing flag per strategy
    const result = strategies.map((s) => ({
      ...s,
      isFollowing: user.following.includes(s.symbol),
    }));

    res.json(result);
  } 
  catch(err){
    res.status(500).json({ message: "Server error" });
  }
});

// Follow a strategy
router.post("/api/follow", authMiddleware, async (req, res) => {
  const { symbol } = req.body;
  try{
    const user = await User.findById(req.user.id);
    if(!user) 
      return res.status(404).json({ message: "User not found" });

    if(!user.following.includes(symbol)){
      user.following.push(symbol);
      await user.save();
    }

    res.json({ message: `Following ${symbol}` });
  } 
  catch(err){
    res.status(500).json({ message: "Server error" });
  }
});

// Unfollow a strategy
router.post("/api/unfollow", authMiddleware, async (req, res) => {
  const { symbol } = req.body;
  try{
    const user = await User.findById(req.user.id);
    if(!user) 
      return res.status(404).json({ message: "User not found" });

    user.following = user.following.filter((s) => s !== symbol);
    await user.save();

    res.json({ message: `Unfollowed ${symbol}` });
  } 
  catch(err){
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
