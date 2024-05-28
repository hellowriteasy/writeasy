const mongoose = require("mongoose");

const storyCorrectionSchema = new mongoose.Schema({
  storyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
  correctionContent: {
    type: String,
    required: true,
  },
  correctionType: {
    type: String,
    enum: ["Line-by-Line", "Summary"],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const StoryCorrection = mongoose.model(
  "StoryCorrection",
  storyCorrectionSchema
);

module.exports = StoryCorrection;
