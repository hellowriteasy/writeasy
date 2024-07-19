const Contest = require("../../src/models/contest");

require("dotenv").config();

const { connectDB } = require("../../config/db");
const Subscription = require("../../src/models/subscription");
const User = require("../../src/models/user");

const main = async () => {
  console.log("Start");
  await connectDB();

  const subscription = await Subscription.find({});

  // await Promise.all(
  //   subscription.map(async (s) => {
  //     const user = await User.findById(s.userId);
  //     user.subscriptionId = s._id;
  //     await user.save();
  //   })
  // );

  console.log("End");
};

main();

// await connectDB();
// console.log("script started");
// await markCashPaymentInSubscription();
// console.log("script ended");
// process.exit(1);
