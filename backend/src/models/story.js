const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  wordCount: { type: Number, required: true },
  submissionDateTime: { type: Date, default: Date.now },
  corrections: [
    { type: mongoose.Schema.Types.ObjectId, ref: "StoryCorrection" },
  ],
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
