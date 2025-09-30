const axios = require("axios");

const FINNHUB_API_KEY = process.env.MARKET_API_KEY;
const FINNHUB_API_URL = process.env.MARKET_API_URL;

exports.getTopMovers = async (req, res) => {
  try{
    // Example: fetch major index constituents (mocking top movers)
    const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN"];
    const promises = symbols.map(sym =>
      axios.get(`${FINNHUB_API_URL}/quote?symbol=${sym}&token=${FINNHUB_API_KEY}`)
    );
    const responses = await Promise.all(promises);

    const movers = responses.map((r, i) => ({
      symbol: symbols[i],
      price: r.data.c, // current price
      change: r.data.dp, // % change
    }));

    res.json(movers);
  } 
  catch(err){
    console.error(err);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
};
