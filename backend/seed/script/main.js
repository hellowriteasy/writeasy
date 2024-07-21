const Contest = require("../../src/models/contest");

require("dotenv").config();

const { connectDB } = require("../../config/db");
const Subscription = require("../../src/models/subscription");
const User = require("../../src/models/user");
const Story = require("../../src/models/story");
const GptService = require("../../src/services/gptService");
const gptService = new GptService(process.env.GPT_API_KEY); // Initialize GPT service

const main = async () => {
  console.log("Start");
  await connectDB();

  let stories = await Story.find({
    contest: "669b2b1c0da4a4d7fce6b924",
  });

  stories = stories.map((story) => ({
    userId: story.user.toString(),
    writing: story.content,
  }));

  const res = await gptService.generateScoreForBulkWritings(
    JSON.stringify(stories)
  );
  console.log(res);

  await console.log("End");
};

main();

// await connectDB();
// console.log("script started");
// await markCashPaymentInSubscription();
// console.log("script ended");
// process.exit(1);
