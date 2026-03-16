require("dotenv").config();
const redis = require("redis");

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

// Handle Redis errors
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Connect Redis
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Redis connected");
    }
  } catch (err) {
    console.error("Redis connection failed:", err.message);
  }
};

module.exports = {
  redisClient,
  connectRedis
};