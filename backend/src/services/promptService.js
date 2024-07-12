const Prompt = require("../models/prompt");
const Contest = require("../models/contest"); // Import Contest model

const createPrompt = async (data) => {
  console.log(data);
  const { promptType } = data;
  if (!["practice", "contest", "game"].includes(promptType)) {
    throw new Error("Invalid prompt type");
  }

  const prompt = new Prompt(data);
  return await prompt.save();
};

const getPromptsByType = async (type, skip, limit) => {
  const total = await Prompt.countDocuments({ promptType: type });
  const data = await Prompt.find(
    { promptType: type },
    {},
    {
      ...(limit ? { limit } : null),
      ...(skip ? { skip } : null),
    }
  ).sort({ createdAt: -1 });
  return { data, total };
};

const getPracticePrompts = (skip, limit) => {
  return getPromptsByType("practice", skip, limit);
};

const getContestPrompts = (skip, limit) => {
  return getPromptsByType("contest", skip, limit);
};

const getGamePrompts = (skip, limit) => {
  return getPromptsByType("game", skip, limit);
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
const getPromptsOfContestId = async (contestId, skip, limit) => {
  const data = await Prompt.find(
    { contestId },
    {},
    {
      ...(limit ? { limit } : null),
      ...(skip ? { skip } : null),
      skip,
    }
  );
  const total = await Prompt.countDocuments({ contestId });
  return {
    total,
    data,
  };
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
  getPromptsOfContestId,
};
