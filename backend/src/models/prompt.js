const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    promptCategory: {
      type: [String],
    },
    description: {
      type: String,
    },
    promptType: {
      type: String,
      enum: ["practice", "contest", "game"],
      required: true, // Assuming each prompt must explicitly be identified as practice or contest
    },
    contestId: {
      type: mongoose.Types.ObjectId,
      ref: "Contest",
    },
    image: {
      type: String,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Prompt = mongoose.model("Prompt", promptSchema);

module.exports = Prompt;
