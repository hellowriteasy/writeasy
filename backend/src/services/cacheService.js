const redisClient = require("../../config/redis");

class CacheService {
  // Retrieve cached data by key
  async get(key) {
    try {
      const data = await redisClient.get(key);
      if (data) {
        return JSON.parse(data); // If data exists, return parsed JSON
      }
      return null;
    } catch (error) {
      console.error(`Error retrieving data from cache: ${error}`);
      return null;
    }
  }

  // Store data in cache
  async set(key, value, expirationTimeInSeconds = 15) {
    try {
      await redisClient.setEx(
        key,
        expirationTimeInSeconds,
        JSON.stringify(value) // Store as a stringified JSON
      );
    } catch (error) {
      console.error(`Error saving data to cache: ${error}`);
    }
  }

  // Clear data from cache by key
  async delete(key) {
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error(`Error deleting cache data: ${error}`);
    }
  }
}

module.exports = new CacheService();
