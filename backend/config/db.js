const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

const initializeDatabase = async () => {
  try {
    // Perform any database initialization tasks here
    // For example, create initial users, prompts, contests, etc.

    // Import schema files
    const User = require("../models/user");
    const Story = require("../models/story");
    const StoryCorrection = require("../models/storyCorrection");
    const Prompt = require("../models/prompt");
    const Contest = require("../models/contest");
    const ContestSubmission = require("../models/contestSubmission");
    const CollaborativeStory = require("../models/collaborativeStory");
    const Collaborator = require("../models/collaborator");
    const Admin = require("../models/admin");

    // Additional initialization tasks can be added here...
  } catch (error) {
    console.error("Database initialization error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { connectDB, initializeDatabase };
