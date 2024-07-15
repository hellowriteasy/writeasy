const { connectDB } = require("../../config/db");
const assignSubscriptionIdToUser = require("./assignSubscriptionIdToUser");
require("dotenv").config();

const main = async () => {
  await connectDB();
  console.log("script started");
  await assignSubscriptionIdToUser();
  console.log("script ended");
  process.exit(1);
};

main();
