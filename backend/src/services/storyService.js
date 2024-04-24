const Story = require("../models/story");

const createStory = async (data) => {
  const story = new Story(data);
  return await story.save();
};

const getAllStories = async () => {
  return await Story.find();
};

const getStoryById = async (storyId) => {
  return await Story.findById(storyId);
};

const updateStory = async (id, data) => {
  return await Story.findByIdAndUpdate(id, data, { new: true });
};

const deleteStory = async (id) => {
  return await Story.findByIdAndDelete(id);
};

module.exports = {
  createStory,
  getAllStories,
  updateStory,
  deleteStory,
  getStoryById,
};
