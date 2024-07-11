const PromptService = require("../services/promptService");

const createPrompt = async (req, res) => {
  try {
    const prompt = await PromptService.createPrompt(req.body);
    res.status(201).json(prompt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPracticePrompts = async (req, res) => {
  let { page, perPage, limit } = req.query;

  perPage = +perPage || 5;
  page = +page || 1;
  limit = +limit || 10;
  const skip = (page - 1) * perPage;

  try {
    const { data, total } = await PromptService.getPracticePrompts(skip, limit);
    res.json({
      data,
      pageData: {
        page,
        perPage,
        total: total,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContestPrompts = async (req, res) => {
  let { page, perPage, limit } = req.query;
  perPage = +perPage || 5;
  page = +page || 1;
  limit = +limit || 10;
  const skip = (page - 1) * perPage;
  try {
    const { data, total } = await PromptService.getContestPrompts(skip, limit);
    res.json({
      data,
      pageData: {
        page,
        perPage,
        total: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGamePrompts = async (req, res) => {
  let { page, perPage, limit } = req.query;
  perPage = +perPage || 5;
  page = +page || 1;
  limit = +limit || 10;
  const skip = (page - 1) * perPage;
  try {
    const { data, total } = await PromptService.getGamePrompts(skip, limit);
    res.json({
      data,
      pageData: {
        page,
        perPage,
        total: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrompt = async (req, res) => {
  try {
    let prompt = await PromptService.getPromptById(req.params.id);
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

const getPromptsByContestId = async (req, res) => {
  try {
    const prompts = await PromptService.getPromptsByContestId(
      req.params.contestId
    );
    if (!prompts) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPromptsOfContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    let { page, perPage, limit } = req.query;
    perPage = +perPage || 5;
    page = +page || 1;
    limit = +limit || 10;
    const skip = (page - 1) * perPage;
    if (!contestId) {
      return res.status(400).json({ message: "Please provide contest id" });
    }
    const { data, total } = await PromptService.getPromptsOfContestId(
      contestId,
      skip,
      limit
    );
    return res.status(200).json({
      data,
      pageData: {
        page,
        perPage,
        total: total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createPrompt,
  getPracticePrompts,
  getContestPrompts,
  getGamePrompts,
  getPrompt,
  updatePrompt,
  deletePrompt,
  getPromptsByContestId,
  getAllPromptsOfContest,
};
