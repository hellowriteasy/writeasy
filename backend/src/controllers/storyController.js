const StoryService = require("../services/storyService");
const GptService = require("../services/gptService");
const Contest = require("../models/contest");
const Prompt = require("../models/prompt");
const { createCollaborativeStory } = require("./collaborativeStoryController");
const Story = require("../models/story");
const gptService = new GptService(process.env.GPT_API_KEY); // Initialize GPT service

const createStory = async (req, res) => {
  try {
    const { content } = req.body;
    // Calculate word count
    const wordCount = content.split(" ").length;

    const story = await StoryService.createStory({ ...req.body, wordCount });

    // if (storyType === "game") {
    //   const newCollaborativeStory = new CollaborativeStory({
    //     title: story.title,
    //     description: story.description,
    //     creatorUser: user,
    //     story_id:story._id,
    //     content: [],
    //     contributors: [],
    //   });
    //   await newCollaborativeStory.save();
    // }

    res.status(201).json({
      message: "Story has been successfully saved.",
      story: story._id,
    }); // Respond without score

    console.log(story);
    // Process the story for scoring in the background
    processStoryForScoring(story._id, story.content, wordCount); // Ensuring 'content' exists in your story model
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Function to handle scoring
async function processStoryForScoring(storyId, content, wordCount) {
  try {
    console.log("processing scoring", storyId, content, wordCount);

    const score = await gptService.generateScore(content); // Get score from GPT API
    const correctionSummary = await gptService.generateCorrectionSummary(
      content,
      score.corrections,
      wordCount
    );
    console.log("correction summmary", correctionSummary);
    await StoryService.updateStory(storyId, {
      score: score.score,
      corrections: score.corrections,
      correctionSummary: correctionSummary,
    }); // Update the story with the score
    console.log(`Score updated for story ${storyId}.`);
  } catch (error) {
    console.error(`Failed to score story ${storyId}:`, error);
  }
}

const getStories = async (req, res) => {
  try {
    const stories = await StoryService.getAllStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStoriesByUserAndType = async (req, res) => {
  const { userId, storyType } = req.query;

  if (!userId || !storyType) {
    return res
      .status(400)
      .json({ message: "userId and storyType are required" });
  }

  try {
    const stories = await StoryService.getStoriesByUserAndType(
      userId,
      storyType
    );
    res.json(stories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getStory = async (req, res) => {
  const storyId = req.params.id;
  try {
    const story = await StoryService.getStoryById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStory = async (req, res) => {
  try {
    const updatedStory = await StoryService.updateStory(
      req.params.id,
      req.body
    );
    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStory = async (req, res) => {
  try {
    await StoryService.deleteStory(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function submitStoryToContest(req, res) {
  const { contestId, promptId } = req.params;
  const { userId, title, content } = req.body;
  // Calculate word count
  console.log(contestId);
  const wordCount = content.split(" ").length;

  try {
    // Ensure the contest and prompt exist and are related
    const contest = await Contest.findById(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const prompt = await Prompt.findById(promptId);
    if (!prompt) return res.status(404).json({ message: "Prompt not found" });

    // Ensure the prompt belongs to the contest
    if (!contest.prompts.includes(prompt._id)) {
      return res
        .status(400)
        .json({ message: "Prompt does not belong to this contest" });
    }

    // Create and save the story linked to the contest
    const story = await StoryService.createStory({
      user: userId,
      title,
      content,
      wordCount,
      contest: contestId,
      prompt: promptId,
      storyType: "contest",
    });
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getTopContestStories = async (req, res) => {
  try {
    const stories = await StoryService.getTopContestStories();
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTopStoriesByPrompt = async (req, res) => {
  const { prompt_id } = req.params;
  const page = req.query.page || 1; // Default page is 1
  const perPage = req.query.perPage || 10; // Default page size is 10
  const skip = (page - 1) * perPage;
  try {
    const topStories = await Story.find({
      prompt: prompt_id,
    })
      .populate("user")
      .populate("contest")
      .populate("contributors")
      .sort({ score: "desc" })
      .skip(skip)
      .limit(perPage);

    const total = await Story.countDocuments({
      prompt: prompt_id,
    });

    return res.status(200).json({
      data: topStories,
      pageData: {
        page,
        total,
        perPage,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error?.message || "Internal server error",
      success: false,
    });
  }
};

const getStoryOfAuserByPrompt = async (req, res) => {
  try {
    const { prompt_id, user_id } = req.params;
    const story = await StoryService.getStoryofUserByPromptId(
      user_id,
      prompt_id
    );
    return res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: error?.message || "Something went wrong" });
  }
};

const getStoriesByContentAndPrompt = async (req, res) => {
  const { prompt_id, contest_id } = req.query;
  const page = req.query.page || 1; // Default page is 1
  const perPage = req.query.perPage || 10; // Default page size is 10
  const skip = (page - 1) * perPage;
  const sortKey = req.query.sortKey || "createdAt";

  try {
    const stories = await Story.find({
      ...(contest_id ? { contest: contest_id } : null),
      ...(prompt_id ? { prompt: prompt_id } : null),
    })
      .sort(getSortInputForStoriesByContestAndPrompt(sortKey, "desc"))
      .skip(skip)
      .limit(perPage);

    return res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: error?.message || "Something went wrong" });
  }
};

const getSortInputForStoriesByContestAndPrompt = (sortKey, direction) => {
  if (sortKey === "createdAt") {
    return {
      createdAt: direction,
    };
  } else if (sortKey === "score") {
    return {
      score: direction,
    };
  } else {
    return {
      createdAt: direction,
    };
  }
};

module.exports = {
  createStory,
  getStories,
  updateStory,
  deleteStory,
  getStory,
  submitStoryToContest,
  getTopContestStories,
  getStoriesByUserAndType,
  getTopStoriesByPrompt,
  getStoryOfAuserByPrompt,
  getStoriesByContentAndPrompt,
};
