const express = require("express");
const axios = require("axios");
const router = express.Router();
const { redisClient } = require("../config/redis");

require("dotenv").config();

const FINNHUB_API = "https://finnhub.io/api/v1";
const API_KEY = process.env.FINNHUB_API_KEY;

router.get("/quote/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const cacheKey = `quote:${symbol}`;

  if(!API_KEY){
    return res.status(500).json({ error: "Finnhub API key not set" });
  }

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const response = await axios.get(`${FINNHUB_API}/quote`, {
      params: { symbol, token: API_KEY },
    });

    const { c, pc } = response.data;

    if(typeof c !== "number" || typeof pc !== "number"){
      return res.status(404).json({ error: "Invalid quote data" });
    }

    const quote = { c: parseFloat(c), pc: parseFloat(pc) };
    await redisClient.setEx(cacheKey, 30, JSON.stringify(quote)); // cache for 30s
    res.json(quote);
  } 
  catch(err){
    const status = err.response?.status || 500;
    const message = err.response?.data?.error || err.message;
    console.error(`Error fetching quote for ${symbol}:`, message);
    res.status(status).json({ error: message });
  }
});

router.get("/news", async (req, res) => {
  if(!API_KEY){
    return res.status(500).json({ error: "Finnhub API key not set" });
  }

  try {
    const cached = await redisClient.get("market:news");
    if (cached) return res.json(JSON.parse(cached));
    
    const response = await axios.get(`${FINNHUB_API}/news`, {
      params: { category: "general", token: API_KEY }
    });
    
    // Get top 5 news
    const news = response.data.slice(0, 5);
    await redisClient.setEx("market:news", 300, JSON.stringify(news)); // cache 5 min
    res.json(news);
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
