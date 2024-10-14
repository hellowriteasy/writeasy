// / Middleware function to retrieve cached data/
const cacheService = require("../src/services/cacheService");
const { extractPaginationDetailsFromQuery } = require("../utils/methods");



const getCachedData = (cacheKey, isPagination) => {
  return async (req, res, next) => {
    try {
      const { search } = req.query;
      const { limit, page, perPage, skip } =
        extractPaginationDetailsFromQuery(req);

      let key = cacheKey;
      console.log("checking cache for 1 ", key);
      if (isPagination) {
        key = `${cacheKey}-${page}-${skip}-${limit}-${perPage}-${search || ""}`;
      }
      console.log("checking cache for 2  ", key);
      const cachedData = await cacheService.get(`${key}`);
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
