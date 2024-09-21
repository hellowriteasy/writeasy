const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    prompts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prompt" }],
    contestTheme: { type: String, required: true },
    description: { type: String, required: false },
    submissionDeadline: { type: Date, required: true },
    comparisionCount: { type: Number, required: false },
    image: { type: String },
    topWritingPercent: { type: Number, default: 50, required: false },
    promptPublishDate: {
      type: Date,
      required: true,
    },
    topWritingPublishDate: {
      type: Date,
      required: true,
    },
    isActive: { type: Boolean, default: true },
    topWritingPublished: { type: Boolean, default: false },
    startedScoringStories: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Contest = mongoose.model("Contest", contestSchema);
module.exports = Contest;
