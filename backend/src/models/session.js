const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // To optimize queries by userId
  },
  ip: {
    type: String,
  },
  location: {
    city: {
      type: String,
    },
    region: {
      type: String,
    },
    country: {
      type: String,
    },
    lat: {
      type: String,
      required: true,
    },
    lon: {
      type: String,
      required: true,
    },
  },
  org: {
    type: String,
  },

  timezone: {
    type: String,
  },
  browser: {
    name: {
      type: String,
    },
    version: {
      type: String,
    },
  },
  os: {
    name: {
      type: String,
    },
    version: {
      type: String,
    },
  },
  userAgent: {
    type: String,
  },
  deviceLanguage: {
    type: String,
  },
  hasChecked: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set to current date and time
  },
});

// Create a model from the schema
const LoginHistory = mongoose.model("LoginHistory", loginHistorySchema);

module.exports = LoginHistory;
