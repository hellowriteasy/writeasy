const { connectDB } = require("../../config/db");
const markCashPaymentInSubscription = require("./markCashPaymentInSubscription");
require("dotenv").config();

const main = async () => {
  await connectDB();
  console.log("script started");
  await markCashPaymentInSubscription();
  console.log("script ended");
  process.exit(1);
};

main();
