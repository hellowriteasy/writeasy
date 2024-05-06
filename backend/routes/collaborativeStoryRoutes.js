const express = require("express");
const router = express.Router();
const {
  getCollaborativeStories,
  createCollaborativeStory,
  inviteCollaborators,
  submitCollaborativePart,
} = require("../src/controllers/collaborativeStoryController");

router.get("/", getCollaborativeStories);
router.post("/", createCollaborativeStory);
router.post("/invite", inviteCollaborators);
router.post("/submit", submitCollaborativePart);

module.exports = router;
