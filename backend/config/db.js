const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const maxRetries = 5;
  let retryCount = 0;
  const retryDelay = 5000; // delay in ms

  while (true) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {});
      console.log("Connected to MongoDB");
      break;
    } catch (error) {
      if (retryCount >= maxRetries) {
        console.error("MongoDB connection error after retries:", error.message);
        process.exit(1);
      }
      retryCount++;
      console.error(
        `MongoDB connection attempt ${retryCount} failed, retrying in ${retryDelay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
};

const initializeDatabase = async () => {
  try {
    // Perform any database initialization tasks here
    // For example, create initial users, prompts, contests, etc.

    // Import schema files
    const User = require("../src/models/user");
    const Story = require("../src/models/story");
    const StoryCorrection = require("../src/models/storyCorrection");
    const Prompt = require("../src/models/prompt");
    const Contest = require("../src/models/contest");
    const ContestSubmission = require("../src/models/contestSubmission");
    const CollaborativeStory = require("../src/models/collaborativeStory");
    const Collaborator = require("../src/models/collaborator");
    const Admin = require("../src/models/admin");

    // Additional initialization tasks can be added here...
  } catch (error) {
    console.error("Database initialization error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { connectDB, initializeDatabase };
