const Prompt = require("../models/prompt");

const createPrompt = async (data, type) => {
  const prompt = new Prompt({ ...data, promptType: type });
  return await prompt.save();
};

const createPracticePrompt = (data) => {
  return createPrompt(data, "practicePrompt");
};

const createContestPrompt = (data) => {
  return createPrompt(data, "contestPrompt");
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

const getPromptById = async (promptId) => {
  return await Prompt.findById(promptId);
};

const updatePrompt = async (id, data) => {
  return await Prompt.findByIdAndUpdate(id, data, { new: true });
};

const deletePrompt = async (id) => {
  return await Prompt.findByIdAndDelete(id);
};

module.exports = {
  createPracticePrompt,
  createContestPrompt,
  getPracticePrompts,
  getContestPrompts,
  getPromptById,
  updatePrompt,
  deletePrompt,
};
