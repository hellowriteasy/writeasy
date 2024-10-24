const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://redis:6379", // Use 'redis' as the hostname
  
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err.message);
});

redisClient.connect();

module.exports = redisClient;
