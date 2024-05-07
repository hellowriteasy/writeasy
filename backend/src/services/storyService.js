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

const getTopContestStories = async () => {
  const totalContestStories = await Story.countDocuments({
    storyType: "contestStory",
  });

  const top20PercentCount = Math.ceil(totalContestStories * 0.2);

  return await Story.find({ storyType: "contestStory" })
    .sort({ score: -1 })
    .limit(top20PercentCount);
};

module.exports = {
  createStory,
  getAllStories,
  updateStory,
  deleteStory,
  getStoryById,
  getTopContestStories,
};
