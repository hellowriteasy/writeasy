const UAParser = require("ua-parser-js");
const ipinfo = require("ipinfo");

const extractPaginationDetailsFromQuery = (req) => {
  const page = +req.query.page || 1; // Default page is 1
  const perPage = +req.query.perPage || 5; // Default page size is 10
  const skip = (page - 1) * perPage;
  const limit = +perPage || 5;

  return {
    page,
    perPage,
    skip,
    limit,
  };
};

// Function to extract the first IP from x-forwarded-for
function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0]; // Extract the first IP in case of multiple proxies
  }
  return req.connection.remoteAddress; // Fallback to remote address if no proxy
}

const getDeviceInfo = (req, userId) => {
  // Parse the user-agent to get device info
  const parser = new UAParser();
  const userAgent = req.headers["user-agent"];
  const deviceInfo = parser.setUA(userAgent).getResult();

  // Get the IP address (will differ depending on whether you're behind a proxy)
  // Extract the client's IP address (handle multiple IPs from x-forwarded-for)
  const ipAddress = getClientIp(req);
  // Return a promise to handle asynchronous geolocation
  return new Promise((resolve, reject) => {
    // Get location data from the IP address
    ipinfo(ipAddress, (err, location) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("location", location);
      console.log("ip address", ipAddress);
      // Construct the device info object

      const info = {
        userId: userId, // You can set or pass the userId dynamically
        browser: {
          name: deviceInfo.browser.name || "Unknown",
          version: deviceInfo.browser.version || "Unknown",
        },
        os: {
          name: deviceInfo.os.name || "Unknown",
          version: deviceInfo.os.version || "Unknown",
        },
        location: {
          city: location.city || "Unknown",
          region: location.region || "Unknown",
          country: location.country || "Unknown",
          lat: location.loc ? location.loc.split(",")[0] : "Unknown", // Latitude
          lon: location.loc ? location.loc.split(",")[1] : "Unknown", // Longitude
        },
        userAgent: userAgent || "Unknown",
        deviceLanguage: req.headers["accept-language"] || "Unknown",
      };

      resolve(info);
    });
  });
};

module.exports = {
  getDeviceInfo,
  extractPaginationDetailsFromQuery,
};
