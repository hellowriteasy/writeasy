const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  prompts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prompt" }],
  contestTheme: { type: String, required: true },
  submissionDeadline: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

const Contest = mongoose.model("Contest", contestSchema);
module.exports = Contest;
