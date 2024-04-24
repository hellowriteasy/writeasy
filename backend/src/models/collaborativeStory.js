const mongoose = require("mongoose");

const collaborativeStorySchema = new mongoose.Schema({
  creatorUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  creationDateTime: { type: Date, default: Date.now },
});

const CollaborativeStory = mongoose.model(
  "CollaborativeStory",
  collaborativeStorySchema
);
module.exports = CollaborativeStory;
