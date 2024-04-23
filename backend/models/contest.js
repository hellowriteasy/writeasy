const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  promptID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prompt",
    required: true,
  },
  contestTheme: {
    type: String,
    required: true,
  },
  submissionDeadline: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Contest = mongoose.model("Contest", contestSchema);

module.exports = Contest;
