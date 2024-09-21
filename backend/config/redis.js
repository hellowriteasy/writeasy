const redis = require("redis");

// Create Redis client
const redisClient = redis.createClient({
  url: "redis://redis:6379", // Use 'redis' as the hostname
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

// Connect to Redis
redisClient.connect();

module.exports = redisClient;
