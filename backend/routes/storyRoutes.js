const express = require("express");
const router = express.Router();
const {
  createStory,
  getStories,
  updateStory,
  deleteStory,
  getStory,
  submitStoryToContest,
} = require("../src/controllers/storyController");
const { scoreStory } = require("../src/controllers/StoryScoreController");

router.post("/", createStory);
router.get("/", getStories);
router.get("/:id", getStory);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);

router.post("/score", scoreStory);
router.post("/contest/:contestId/prompt/:promptId", submitStoryToContest);

module.exports = router;
