const UAParser = require("ua-parser-js");
const ipinfo = require("ipinfo");
const Haversine = require("haversine-distance"); // A library for distance calculation
const moment = require("moment"); // To handle dates
const LoginHistory = require("../src/models/session");
const EmailServiceClass = require("../src/services/emailService");
const User = require("../src/models/user");
const { default: mongoose } = require("mongoose");
const EmailService = new EmailServiceClass();
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

  const ipAddress = getClientIp(req);

  return new Promise((resolve, reject) => {
    ipinfo(ipAddress, (err, location) => {
      if (err) {
        reject(err);
        return;
      }

      // Logging for debugging
      console.log("Location data:", location);
      console.log("IP address:", ipAddress);

      const info = {
        userId: userId || "Unknown", // Set or pass the userId dynamically
        browser: {
          name: deviceInfo.browser.name || "Unknown",
          version: deviceInfo.browser.version || "Unknown",
        },
        os: {
          name: deviceInfo.os.name || "Unknown",
          version: deviceInfo.os.version || "Unknown",
        },
        ip: ipAddress || "Unknown",
        location: {
          city: location.city || "Unknown",
          region: location.region || "Unknown",
          country: location.country || "Unknown",
          lat: location.loc ? location.loc.split(",")[0] : "Unknown", // Latitude
          lon: location.loc ? location.loc.split(",")[1] : "Unknown", // Longitude
          org: location.org || "Unknown", // Organization
          postal: location.postal || "Unknown", // Postal Code
          timezone: location.timezone || "Unknown", // Timezone
        },
        userAgent: userAgent || "Unknown",
        deviceLanguage: req.headers["accept-language"] || "Unknown",
      };

      resolve(info);
    });
  });
};

function isAccountSuspicious(logins) {
  const now = moment();

  const suspiciousThreshold = 100; // Distance threshold in km
  const loginTimeLimit = 60; // Time limit in minutes

  // Track unique locations and login times
  const locations = {};

  logins.forEach((login) => {
    const userId = login.userId;
    const location = login.location;
    const timestamp = moment(login.timestamp); // Assuming each login has a timestamp

    if (!locations[userId]) {
      locations[userId] = [];
    }

    locations[userId].push({ location: location, timestamp: timestamp });
  });

  // Check for suspicious behavior
  for (const userId in locations) {
    const userLogins = locations[userId];

    for (let i = 0; i < userLogins.length; i++) {
      const currentLogin = userLogins[i];

      for (let j = i + 1; j < userLogins.length; j++) {
        const comparedLogin = userLogins[j];

        // Calculate the time difference
        const timeDifference = moment(comparedLogin.timestamp).diff(
          currentLogin.timestamp,
          "minutes"
        );

        // Calculate distance using Haversine formula
        const distance = Haversine(
          {
            latitude: parseFloat(currentLogin.location.lat),
            longitude: parseFloat(currentLogin.location.lon),
          },
          {
            latitude: parseFloat(comparedLogin.location.lat),
            longitude: parseFloat(comparedLogin.location.lon),
          }
        );

        // Check for suspicious activity
        if (
          timeDifference < loginTimeLimit &&
          distance > suspiciousThreshold * 1000
        ) {
          // Convert km to meters
          return {
            isSuspicious: true,
            suspiciousReason: `Suspicious login detected: City 1: ${
              currentLogin.location.city
            }, Country 1: ${
              currentLogin.location.country
            }, Time 1: ${currentLogin.timestamp.format(
              "YYYY-MM-DD HH:mm:ss"
            )} and City 2: ${comparedLogin.location.city}, Country 2: ${
              comparedLogin.location.country
            }, Time 2: ${comparedLogin.timestamp.format(
              "YYYY-MM-DD HH:mm:ss"
            )}.`,
            actionType: "Simultaneous logins from different locations.",
          };
        }

        // Check for frequent location changes
        if (
          timeDifference < loginTimeLimit * 2 &&
          distance > suspiciousThreshold * 1000
        ) {
          return {
            isSuspicious: true,
            suspiciousReason: `Frequent location change detected: \n City 1: ${
              currentLogin.location.city
            }\n Country 1: ${
              currentLogin.location.country
            }\n Time 1: ${currentLogin.timestamp.format(
              "YYYY-MM-DD HH:mm:ss"
            )}\n and City 2: ${comparedLogin.location.city},\n Country 2: ${
              comparedLogin.location.country
            }\n, Time 2: ${comparedLogin.timestamp.format(
              "YYYY-MM-DD HH:mm:ss"
            )}.`,
            actionType: "Frequent and unexplained location changes.",
          };
        }
      }
    }
  }

  // If no suspicious activity is detected
  return {
    isSuspicious: false,
    suspiciousReason: "",
    actionType: "",
  };
}

// Function to check IP address validation limits
const checkIpAddressValidationChangedLimits = async (
  userId,
  maxIpAddressChangeLimit
) => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

  try {
    const userExist = await User.findById(userId);

    if (!userExist) {
      throw new Error("User not found");
    }
    // Retrieve login history for the last 24 hours for the specific user
    const loginHistories = await LoginHistory.find({
      userId: userId, // Ensure userId is a valid ObjectId
      timestamp: { $gte: twentyFourHoursAgo },
    });

    // Create a Set to collect unique IP addresses
    const uniqueIpAddresses = new Set();

    // Populate the Set with IP addresses from login histories
    loginHistories.forEach((history) => {
      if (history.ip) {
        uniqueIpAddresses.add(history.ip);
      }
    });

    console.log(`Number of unique IP addresses: ${uniqueIpAddresses.size}.`);

    // Check if the number of unique IP addresses exceeds the limit
    if (uniqueIpAddresses.size > maxIpAddressChangeLimit) {
      // Send email to the admin
      console.log(
        "Suspicious activity detected: More than the allowed IP address changes."
      );
      // Here you can add your code to send an email to the admin
      // Example: await sendEmailToAdmin(userId, uniqueIpAddresses);
      await EmailService.sendEmail({
        email: process.env.APP_EMAIL,
        subject: `Suspicious activity detected for account ${userExist.email}`,
        message: `Login Histories : ${JSON.stringify(loginHistories, null, 2)}`,
      });
    } else {
      console.log("IP address change limit not exceeded.");
    }
  } catch (error) {
    console.error("Error checking IP address validation limits:", error);
  }
};

module.exports = {
  getDeviceInfo,
  extractPaginationDetailsFromQuery,
  isAccountSuspicious,
  checkIpAddressValidationChangedLimits,
};
