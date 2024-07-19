const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    prompts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prompt" }],
    contestTheme: { type: String, required: true },
    description: { type: String, required: true },
    submissionDeadline: { type: Date, required: true },
    promptPublishDate: {
      type: Date,
      required: true,
    },
    topWritingPublishDate: {
      type: Date,
      required: true,
    },
    isActive: { type: Boolean, default: true },
    promptPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Contest = mongoose.model("Contest", contestSchema);
module.exports = Contest;
