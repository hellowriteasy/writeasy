const StoryService = require("../services/storyService");

const createStory = async (req, res) => {
  try {
    const story = await StoryService.createStory(req.body);
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
