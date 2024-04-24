const PromptService = require("../services/promptService");

const createPrompt = async (req, res) => {
  try {
    const prompt = await PromptService.createPrompt(req.body);
    res.status(201).json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrompts = async (req, res) => {
  try {
    const prompts = await PromptService.getAllPrompts();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrompt = async (req, res) => {
  const promptId = req.params.id;
  try {
    const prompt = await PromptService.getPromptById(promptId);
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
  createPrompt,
  getPrompts,
  updatePrompt,
  deletePrompt,
  getPrompt,
};
