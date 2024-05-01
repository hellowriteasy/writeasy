const StoryService = require("../services/storyService");
const GptService = require("../services/GptService");

const gptService = new GptService(process.env.GPT_API_KEY); // Initialize GPT service

const createStory = async (req, res) => {
  try {
    const story = await StoryService.createStory(req.body);
    res.status(201).json({ message: "Story has been successfully saved." }); // Respond without score

    // Process the story for scoring in the background
    processStoryForScoring(story._id, story.content); // Ensuring 'content' exists in your story model
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to handle scoring
async function processStoryForScoring(storyId, content) {
  try {
    const score = await gptService.generateScore(content); // Get score from GPT API
    await StoryService.updateStory(storyId, { score }); // Update the story with the score
    console.log(`Score updated for story ${storyId}.`);
  } catch (error) {
    console.error(`Failed to score story ${storyId}:`, error);
  }
}

const getStories = async (req, res) => {
  try {
    const stories = await StoryService.getAllStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStory = async (req, res) => {
  const storyId = req.params.id;
  try {
    const story = await StoryService.getStoryById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStory = async (req, res) => {
  try {
    const updatedStory = await StoryService.updateStory(
      req.params.id,
      req.body
    );
    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStory = async (req, res) => {
  try {
    await StoryService.deleteStory(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStory,
  getStories,
  updateStory,
  deleteStory,
  getStory,
};
