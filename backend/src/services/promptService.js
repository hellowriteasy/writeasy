const Prompt = require("../models/prompt");
const Contest = require("../models/contest"); // Import Contest model

const createPrompt = async (data) => {
  const { promptType } = data;
  if (!["practice", "contest", "game"].includes(promptType)) {
    throw new Error("Invalid prompt type");
  }

  const prompt = new Prompt(data);
  return await prompt.save();
};

const getPromptsByType = async (type, skip, limit, category) => {
  const total = await Prompt.countDocuments({
    promptType: type,
    ...(category
      ? {
          promptCategory: {
            $in: category ? [category] : [], // Ensure category is properly handled as an array
          },
        }
      : null),
  });

  const data = await Prompt.find(
    {
      promptType: type,
      ...(category
        ? {
            promptCategory: {
              $in: category ? [category] : [], // Ensure category is properly handled as an array
            },
          }
        : null),
    },
    null, // Use null instead of an empty object for the projection parameter
    {
      limit: limit || undefined, // Only add limit if it's defined
      skip: skip || undefined, // Only add skip if it's defined
      sort: { createdAt: -1 }, // Keep sort inside the third argument object
    }
  );
  return { data, total };
};

const getPracticePrompts = (skip, limit, category) => {
  return getPromptsByType("practice", skip, limit, category);
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
      sort: {
        createdAt: "desc",
      },
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
