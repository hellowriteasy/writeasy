const redis = require("redis");

// Create Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://redis:6379", // Use 'redis' as the hostname
  
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err.message);
});

// Connect to Redis
redisClient.connect();

module.exports = redisClient;
