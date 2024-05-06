const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  wordCount: { type: Number, required: true },
  submissionDateTime: { type: Date, default: Date.now },
  score: { type: Number }, // Score as a numeric type
  corrections: [
    { type: mongoose.Schema.Types.ObjectId, ref: "StoryCorrection" },
  ],
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: true,
  },
  prompt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prompt",
    required: true,
  },
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
