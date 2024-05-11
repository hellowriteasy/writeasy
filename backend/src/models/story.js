const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  wordCount: { type: Number, required: true },
  submissionDateTime: { type: Date, default: Date.now },
  score: { type: Number },
  corrections: {
    type: String,
  },
  prompt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prompt",
    required: true, // Can be either a practice-prompt or a contest-prompt
  },
  storyType: {
    // New attribute to specify if it's a practice story or a contest story
    type: String,
    enum: ["practiceStory", "contestStory"],
    required: true,
  },
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: function () {
      return this.storyType === "contestStory"; // Only required if it's a contest story
    },
  },
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
