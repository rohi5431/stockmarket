const { redisClient } = require("../config/redis");

const getMLInsights = async (req, res) => {
  const { symbol } = req.params;
  const { price_change, moving_average, volume } = req.body;

  if (!symbol) {
    return res.status(400).json({ error: "Stock symbol is required." });
  }

  // Provide some default features if not provided
  const pc = parseFloat(price_change) || 0.0;
  const ma = parseFloat(moving_average) || 100.0;
  const vol = parseFloat(volume) || 5000.0;

  const cacheKey = `ml_insights:${symbol}`;

  try {
    // Check Redis cache first
    const cachedInsights = await redisClient.get(cacheKey);
    if (cachedInsights) {
      return res.json(JSON.parse(cachedInsights));
    }

    const FASTAPI_URL = process.env.FASTAPI_URL || "http://127.0.0.1:8000";

    // Call /predict-signal
    const signalRes = await fetch(`${FASTAPI_URL}/predict-signal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price_change: pc, moving_average: ma, volume: vol })
    });
    
    // Call /detect-anomaly
    const anomalyRes = await fetch(`${FASTAPI_URL}/detect-anomaly`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price_change: pc, moving_average: ma, volume: vol })
    });

    const signalData = await signalRes.json();
    const anomalyData = await anomalyRes.json();

    const result = {
      symbol,
      signal: signalData.signal || "Neutral",
      confidence: signalData.confidence || 0.5,
      is_anomaly: anomalyData.is_anomaly || false,
      anomaly_score: anomalyData.score || 0
    };

    // Cache the result in Redis for 1 minute (60 seconds)
    await redisClient.setEx(cacheKey, 60, JSON.stringify(result));

    return res.json(result);

  } catch (error) {
    console.error("ML Service Error:", error);
    // Return safe fallback
    return res.status(200).json({
      symbol: symbol,
      signal: "Neutral",
      confidence: 0,
      is_anomaly: false,
      anomaly_score: 0,
      error: "ML service unavailable"
    });
  }
};

module.exports = { getMLInsights };
