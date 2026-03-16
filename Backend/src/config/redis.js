require("dotenv").config();
const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,   // always use your cloud Redis URL
});

redisClient.on("error", (err) => console.error("Redis error:", err));

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
};

module.exports = { redisClient, connectRedis };