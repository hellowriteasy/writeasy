const mongoose = require("mongoose");

const siteConfig = new mongoose.Schema({
  sitePractiseLimit: {
    type: Number,
    default: 5,
  },
});

const siteConfigModel = mongoose.model("siteconfigs", siteConfig);

module.exports = siteConfigModel;
