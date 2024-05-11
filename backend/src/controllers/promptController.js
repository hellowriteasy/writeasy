const PromptService = require("../services/promptService");

const createPracticePrompt = async (req, res) => {
  try {
    const prompt = await PromptService.createPracticePrompt(req.body);
    res.status(201).json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createContestPrompt = async (req, res) => {
  try {
    const prompt = await PromptService.createContestPrompt(req.body);
    res.status(201).json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPracticePrompts = async (req, res) => {
  try {
    const prompts = await PromptService.getPracticePrompts();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContestPrompts = async (req, res) => {
  try {
    const prompts = await PromptService.getContestPrompts();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrompt = async (req, res) => {
  try {
    const prompt = await PromptService.getPromptById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    res.json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePrompt = async (req, res) => {
  try {
    const updatedPrompt = await PromptService.updatePrompt(
      req.params.id,
      req.body
    );
    res.json(updatedPrompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePrompt = async (req, res) => {
  try {
    await PromptService.deletePrompt(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPracticePrompt,
  createContestPrompt,
  getPracticePrompts,
  getContestPrompts,
  getPrompt,
  updatePrompt,
  deletePrompt,
};
