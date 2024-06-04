const mongoose = require("mongoose");

const collaboratorSchema = new mongoose.Schema({
  storyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollaborativeStory",
    required: true,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Collaborator = mongoose.model("Collaborator", collaboratorSchema);

module.exports = Collaborator;
