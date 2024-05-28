const Prompt = require("../models/prompt");
const Contest = require("../models/contest"); // Import Contest model

const createPrompt = async (data) => {
  const { promptType } = data;
  if (!["practicePrompt", "contestPrompt", "gamesPrompt"].includes(promptType)) {
    throw new Error("Invalid prompt type");
  }

  const prompt = new Prompt(data);
  return await prompt.save();
};

const getPromptsByType = async (type) => {
  return await Prompt.find({ promptType: type });
};

const getPracticePrompts = () => {
  return getPromptsByType("practicePrompt");
};

const getContestPrompts = () => {
  return getPromptsByType("contestPrompt");
};

const getGamePrompts = () => {
  return getPromptsByType("gamePrompt");
};

const getPromptById = async (promptId) => {
  return await Prompt.findById(promptId);
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

module.exports = {
  createPrompt,
  getPracticePrompts,
  getContestPrompts,
  getGamePrompts,
  getPromptById,
  updatePrompt,
  deletePrompt,
  getPromptsByContestId,
};