const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  wordCount: {
    type: Number,
    required: true,
  },
  submissionDateTime: {
    type: Date,
    default: Date.now,
  },
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
