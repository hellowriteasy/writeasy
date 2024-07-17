const { connectDB } = require("../../config/db");
const deleteGameStories = require("./deleteGameStory");
require("dotenv").config();

const main = async () => {
  await connectDB();
  console.log("script started");
  await deleteGameStories();
  console.log("script ended");
  process.exit(1);
};

main();
