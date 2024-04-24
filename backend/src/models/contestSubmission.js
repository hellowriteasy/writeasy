const mongoose = require("mongoose");

const contestSubmissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: true,
  },
  submissionContent: { type: String, required: true },
  submissionDateTime: { type: Date, default: Date.now },
  score: { type: Number },
});

const ContestSubmission = mongoose.model(
  "ContestSubmission",
  contestSubmissionSchema
);
module.exports = ContestSubmission;
