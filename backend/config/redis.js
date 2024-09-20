const redis = require("redis");

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // default Redis URL
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

// Connect to Redis
redisClient.connect();

module.exports = redisClient;
