const redisClient = require("../../config/redis");

class CacheService {
  // Retrieve cached data by key
  constructor() {
    this.redisClient = redisClient;
  }
  async get(key) {
    try {
      const data = await this.redisClient.get(key);
      if (data) {
        return JSON.parse(data); // If data exists, return parsed JSON
      }
      return null;
    } catch (error) {
      console.error(`Error retrieving data from cache: ${error}`);
      throw Error("Error retrieving data from cache");
    }
  }

  // Store data in cache
  async set(key, value, expirationTimeInSeconds = 15) {
    try {
      await this.redisClient.setEx(
        key,
        expirationTimeInSeconds,
        JSON.stringify(value) // Store as a stringified JSON
      );
    } catch (error) {
      console.error(`Error saving data to cache: ${error}`);
      throw Error("Error retrieving data from cache");
    }
  }

  // Clear data from cache by key
  async delete(key) {
    try {
      await this.redisClient.del(key);
    } catch (error) {
      console.error(`Error deleting cache data: ${error}`);
      throw Error("Error retrieving data from cache");
    }
  }
  // Expose a property that checks if Redis is connected
  get isConnected() {
    return this.redisClient.isReady; // Returns true if Redis is connected
  }
}

module.exports = new CacheService();
