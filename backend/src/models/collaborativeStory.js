const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  approved: { type: Boolean, default: false },
});

const collaborativeStorySchema = new mongoose.Schema({
  creatorUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  content: [contentSchema],
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  creationDateTime: { type: Date, default: Date.now },
});

const CollaborativeStory = mongoose.model(
  "CollaborativeStory",
  collaborativeStorySchema
);
module.exports = CollaborativeStory;
