// / Middleware function to retrieve cached data/
const cacheService = require("../src/services/cacheService");

const getCachedData = (cacheKey) => {
  return async (req, res, next) => {
    try {
      console.log("checking cache");
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        console.log("data in cache");
        return res.json(cachedData);
      }
      // Move to the next middleware or route handler if no cache
      next();
    } catch (error) {
      console.error(`Error retrieving cache for ${cacheKey}:`, error);
      next(); // Continue to the next middleware/handler if there's an error
    }
  };
};

module.exports = getCachedData;
