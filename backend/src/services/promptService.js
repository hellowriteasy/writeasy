const Prompt = require("../models/prompt");
const Contest = require("../models/contest"); // Import Contest model

const createPrompt = async (data) => {
  console.log(data)
  const { promptType } = data;
  if (!["practice", "contest","game"].includes(promptType)) {
    throw new Error("Invalid prompt type");
  }

  const prompt = new Prompt(data);
  return await prompt.save();
};

const getPromptsByType = async (type) => {
  return await Prompt.find({ promptType: type });
};

const getPracticePrompts = () => {
  return getPromptsByType("practice");
};

const getContestPrompts = () => {
  return getPromptsByType("contest");
};

const getGamePrompts = () => {
  return getPromptsByType("game");
};

const getPromptById = async (promptId) => {
  return await Prompt.findById(promptId).populate("contestId");
};

const updatePrompt = async (id, data) => {
  return await Prompt.findByIdAndUpdate(id, data, { new: true });
};

const deletePrompt = async (id) => {
  return await Prompt.findByIdAndDelete(id);
};

const getPromptsByContestId = async (contestId) => {
  const contest = await Contest.findById(contestId)
    .populate("prompts")
    .lean()
    .exec();
  
  if (!contest) {
    return null; // Contest not found
  }

  return contest.prompts; // Return prompts belonging to the contest
};
const getPromptsOfContestId = async (contestId) => {
  return await Prompt.find({contestId})
}
module.exports = {
  createPrompt,
  getPracticePrompts,
  getContestPrompts,
  getGamePrompts,
  getPromptById,
  updatePrompt,
  deletePrompt,
  getPromptsByContestId,
  getPromptsOfContestId,
};