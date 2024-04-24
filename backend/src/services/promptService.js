const Prompt = require("../models/prompt");

const createPrompt = async (data) => {
  const prompt = new Prompt(data);
  return await prompt.save();
};

const getAllPrompts = async () => {
  return await Prompt.find();
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
  createPrompt,
  getAllPrompts,
  updatePrompt,
  deletePrompt,
  getPromptById,
};
