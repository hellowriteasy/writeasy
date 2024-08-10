const StoryService = require("../services/storyService");
const GptService = require("../services/gptService");
const Contest = require("../models/contest");
const Prompt = require("../models/prompt");
const Story = require("../models/story");
const gptService = new GptService(process.env.GPT_API_KEY); // Initialize GPT service

const createStory = async (req, res) => {
  try {
    const { content, contest, prompt } = req.body;
    const contestExist = await Contest.findById(contest);
    if (!contestExist) {
      throw new Error("Contest not found");
    }
    if (contestExist.submissionDeadline.getTime() < new Date().getTime()) {
      throw new Error("Contest submission deadline has been reached");
    }

    const promptExist = await Prompt.findById(prompt);

    if (!promptExist) {
      throw new Error("Prompt not found");
    }

    const wordCount = content.split(" ").length;
    const story = await StoryService.createStory({ ...req.body, wordCount });
    res.status(201).json({
      message: "Story has been successfully saved.",
      story: story._id,
    });

    // Process the story for scoring in the background
    // processStoryForScoring(
    //   story._id,
    //   story.content,
    //   wordCount,
    //   promptExist.title
    // ); // Ensuring 'content' exists in your story model
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Function to handle scoring
async function processStoryForScoring(storyId, content, wordCount, topic) {
  try {
    console.log("processing scoring", storyId, content, wordCount);

    const score = await gptService.generateScore(content, "", wordCount, topic); // Get score from GPT API
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
  const storyType = req.query.storyType;
  try {
    const stories = await StoryService.getAllStories(storyType);
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStoriesByUserAndType = async (req, res) => {
  const { userId, storyType } = req.query;
  const page = req.query.page || 1; // Default page is 1
  const perPage = req.query.perPage || 5; // Default page size is 10
  const skip = (page - 1) * perPage;
  const limit = +perPage || 5;
  if (!userId || !storyType) {
    return res
      .status(400)
      .json({ message: "userId and storyType are required" });
  }

  try {
    const { data, total } = await StoryService.getStoriesByUserAndType(
      userId,
      storyType,
      limit,
      skip
    );
    res.json({
      data,
      pageData: {
        page,
        perPage,
        total,
      },
    });
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
    res.status(200).send("Story deleted successfully");
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
  const perPage = req.query.perPage || 5; // Default page size is 10
  const skip = (page - 1) * perPage;
  const limit = +perPage || 5;
  try {
    const topStories = await Story.find(
      {
        prompt: prompt_id,
      },
      {},
      {
        ...(skip ? { skip } : null),
        ...(limit ? { limit } : null),
      }
    )
      .populate("user")
      .populate("contest")
      .populate("contributors")
      .sort({ score: "desc" });

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
    console.log(error);
    res.status(500).json({ message: error?.message || "Something went wrong" });
  }
};

const getStoriesByContentAndPrompt = async (req, res) => {
  const { prompt_id, contest_id } = req.query;
  const exclude_top_writings = req.query.exclude_top_writings === "true";
  const page = +req.query.page || 1; // Default page is 1
  const perPage = +req.query.perPage || 5; // Default page size is 10
  const skip = (page - 1) * perPage;
  const limit = +perPage || 5;
  const sortKey = req.query.sortKey || "createdAt";
  try {
    const total = await Story.countDocuments({
      ...(contest_id ? { contest: contest_id } : null),
      ...(prompt_id ? { prompt: prompt_id } : null),
      ...(exclude_top_writings
        ? {
            $or: [
              { isTopWriting: false },
              { isTopWriting: { $exists: false } },
            ],
          }
        : {}),
    });
    const stories = await Story.find(
      {
        ...(contest_id ? { contest: contest_id } : null),
        ...(prompt_id ? { prompt: prompt_id } : null),
        ...(exclude_top_writings
          ? {
              $or: [
                { isTopWriting: false },
                { isTopWriting: { $exists: false } },
              ],
            }
          : {}),
      },
      {},
      {
        ...(skip ? { skip } : null),
        ...(limit ? { limit } : null),
      }
    )
      .populate({
        select: {
          username: 1,
          email: 1,
          profile_picture: 1,
        },
        path: "user",
      })
      .populate("prompt")
      .populate("contributors")
      .sort(getSortInputForStoriesByContestAndPrompt(sortKey, "desc"))
      .skip(skip)
      .limit(perPage);

    return res.status(200).json({
      data: stories,
      pageData: {
        page,
        total,
        perPage,
      },
    });
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
const savePractiseStoryToProfile = async (req, res) => {
  const { userId, title, content, taskType, storyType, prompt } = req.body;

  const wordCount = content.split(" ").length; // Calculate word count

  try {
    const newStory = await new Story({
      title,
      storyType,
      content,
      user: userId,
      prompt,
      wordCount,
      hasSaved: true,
    });
    await newStory.save();
    res.status(201).json({ message: "successfully saved to profile" });
    processCorrectionAndSummary({
      story_id: newStory._id,
      content,
      taskType,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || "Error saving to profile" });
  }
};

const processCorrectionAndSummary = async ({
  story_id,
  content,
  taskType,
  wordCount,
}) => {
  try {
    console.log("processing correction and summary 1", story_id);
    const correction = await gptService.generateCorrection(
      content,
      taskType,
      wordCount
    );
    console.log("processing correction 2", correction);

    const summary = await gptService.generateCorrectionSummary(
      content,
      correction
    );
    console.log("processing correction summary 3 ", summary);
    await Story.findByIdAndUpdate(story_id, {
      corrections: correction,
      correctionSummary: summary,
    });
  } catch (error) {
    console.log("error generating correction summary", error);
  }
};

const getTopStoriesForContest = async (req, res) => {
  const { id } = req.params;
  let { page, perPage } = req.query;

  // Ensure page has a default value if not provided
  page = +page || 1;
  perPage = +perPage || 5;

  const skip = (page - 1) * perPage;

  try {
    const total = await Story.countDocuments({
      contest: id,
      isTopWriting: true,
    });

    const stories = await Story.find({
      contest: id,
      isTopWriting: true,
    })
      .sort({ score: -1 })
      .skip(skip) // Directly use skip
      .limit(perPage) // Directly use limit
      .populate({
        path: "user",
        select: "-password", // Using a string for field exclusion
      });

    return res.status(200).json({
      data: stories,
      pageData: {
        page,
        perPage,
        total,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching stories.",
      error,
    });
  }
};

const getPreviousWeekTopStories = async (req, res) => {
  try {
    const lastWeekContest = await Contest.find({
      isActive: false,
      topWritingPublished: true,
    }).sort({
      createdAt: "descending",
    });
    console.log(lastWeekContest);

    const lastWeekContestTopStories = await Story.find({
      contest: lastWeekContest[0]?._id,
      isTopWriting: true,
    }).populate({
      path: "user",
      select: "-password",
    });

    res.status(200).json({ data: lastWeekContestTopStories || [] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while fetching previous week top stories.",
      error,
    });
  }
};

const markTopStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    if (story.isTopWriting) {
      if (!story) {
        return res
          .status(409)
          .json({ message: "Story is already marked as top writing" });
      }
    }
    story.isTopWriting = true;
    await story.save();
    res.status(200).json({ message: "Story marked as top story" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};
const removeTopStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await Story.findById(id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }
    if (!story.isTopWriting) {
      if (!story) {
        return res.status(409).json({ message: "Story is not a top story " });
      }
    }
    story.isTopWriting = false;
    await story.save();
    res.status(200).json({ message: "Story removed from a top story" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};

const calculateTopWritings = async (req, res) => {
  console.log("req.body", req.body); // Log entire body
  const { stories, title } = req.body;
  console.log("stories", stories);

  try {
    if (!stories || !title) {
      throw new Error("Stories and title are required");
    }
    if (stories.length < 2) {
      throw new Error("Story must be at least 2 ");
    }
    const results = await gptService.rankStories(stories,title);
    return res.status(200).json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};
module.exports = {
  removeTopStory,
  markTopStory,
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
  savePractiseStoryToProfile,
  getTopStoriesForContest,
  getPreviousWeekTopStories,
  calculateTopWritings,
};
