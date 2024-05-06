const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  wordCount: { type: Number, required: true },
  submissionDateTime: { type: Date, default: Date.now },
  score: { type: Number },
  corrections: [
    { type: mongoose.Schema.Types.ObjectId, ref: "StoryCorrection" },
  ],
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: function () {
      return this.storyType === "contestStory"; // Only required if it's a contest story
    },
  },
  prompt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prompt",
    required: true,
  },
  storyType: {
    // New attribute to specify if it's a practice story or a contest story
    type: String,
    enum: ["practiceStory", "contestStory"],
    required: true,
  },
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
