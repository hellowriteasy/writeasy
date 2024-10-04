const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String },
    content: { type: String },
    wordCount: { type: Number },
    submissionDateTime: { type: Date, default: Date.now },
    score: { type: Number },
    hasEnded: { type: Boolean, default: false },
    corrections: {
      type: String,
    },
    correctionSummary: { type: String },
    prompt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prompt",
      required: true, // Can be either a practice-prompt or a contest-prompt
    },
    storyType: {
      // New attribute to specify if it's a practice story or a contest story
      type: String,
      enum: ["practice", "contest", "game"],
      required: true,
    },
    hasSaved: {
      type: Boolean,
      default: false,
    },
    position: {
      type: Number,
    },
    score: {
      type: Number,
    },
    isTopWriting: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    contest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: function () {
        return this.storyType === "contest"; // Only required if it's a contest story
      },
    },
    contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
const Story = mongoose.model("Story", storySchema);
module.exports = Story;
