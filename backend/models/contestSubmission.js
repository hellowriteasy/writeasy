const mongoose = require("mongoose");

const contestSubmissionSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contestID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: true,
  },
  submissionContent: {
    type: String,
    required: true,
  },
  submissionDateTime: {
    type: Date,
    default: Date.now,
  },
  score: {
    type: Number,
  },
});

const ContestSubmission = mongoose.model(
  "ContestSubmission",
  contestSubmissionSchema
);

module.exports = ContestSubmission;
