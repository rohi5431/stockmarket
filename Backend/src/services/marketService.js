const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/quote/:symbol", async (req, res) => {
  const { symbol } = req.params;
  try{
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );

    res.json(response.data);
  } 
  catch(err){
    console.error(err); // <--- Make sure you log the error
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
