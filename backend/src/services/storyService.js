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
  const aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7); // Fetches the date 7 days prior from today

  const totalContestStories = await Story.countDocuments({
    storyType: "contestStory",
    submissionDateTime: {
      $gte: aWeekAgo, // Compares if the date of story submission falls in the last 7 days
    },
  });

  const top20PercentCount = Math.ceil(totalContestStories * 0.2);

  return await Story.find({
    storyType: "contestStory",
    submissionDateTime: {
      $gte: aWeekAgo, // Compares if the date of story submission falls in the last 7 days
    },
  })
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
