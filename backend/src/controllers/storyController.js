const StoryService = require("../services/storyService");
const GptService = require("../services/gptService");
const Contest = require("../models/contest");
const Prompt = require("../models/prompt");
const Story = require("../models/story");
const gptService = new GptService(process.env.GPT_API_KEY); // Initialize GPT service
const fs = require("fs");
const emailServiceClass = require("../services/emailService");
const path = require("path");
const nodemailer = require("nodemailer");
const cacheService = require("../services/cacheService");
const cacheTypes = require("../utils/types/cacheType");

const createStory = async (req, res) => {
  try {
    const { content, contest, prompt, storyType, user } = req.body;
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
    if (storyType === "contest") {
      const storyExist = await Story.findOne({
        prompt,
        user,
        contest,
      });
      if (storyExist) {
        throw new Error("Story already exists");
      }
    }

    const wordCount = content.split(" ").length;
    const story = await StoryService.createStory({ ...req.body, wordCount });
    res.status(201).json({
      message: "Story has been successfully saved.",
      story: story._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message || "Failed " });
  }
};

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
  const { prompt_id, contest_id, public } = req.query;
  const exclude_top_writings = req.query.exclude_top_writings === "true";
  const page = +req.query.page || 1; // Default page is 1
  const perPage = +req.query.perPage || 5; // Default page size is 10
  const skip = (page - 1) * perPage;
  const limit = +perPage || 5;
  const sortKey = req.query.sortKey || "createdAt";
  const isPublic = public === "true";

  console.log("is public", isPublic);
  try {
    const contestExist = await Contest.findById(contest_id);

    const hasTopWritingPublished = contestExist?.topWritingPublished;
    const total = await Story.countDocuments({
      ...(contest_id ? { contest: contest_id } : null),
      ...(prompt_id ? { prompt: prompt_id } : null),
      ...(public ? { isPublic: isPublic } : null),
      ...(exclude_top_writings && hasTopWritingPublished
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
        ...(public ? { isPublic: isPublic } : null),
        ...(exclude_top_writings && hasTopWritingPublished
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
      .sort({
        updatedAt: "desc",
      })
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
      .populate("contest");

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


const savePractiseStoryToProfile = async (req, res) => {
  const {
    userId,
    title,
    content,
    taskType,
    storyType,
    prompt,
    storyId,
    isPublic,
    isPrevious,
  } = req.body;

  try {
    console.log("storyid", storyId);
    
    if (storyId) {
      await Story.findByIdAndUpdate(storyId, {
        hasSaved: true,
        isPublic: isPublic,
        ...(isPrevious ? { content } : null),
      });
    }
    if (!storyId) {
      await Story.create({
        content,
        user: userId,
        prompt,
        hasSaved: true,
        isPublic,
        title,
        storyType: "practice",
      });
    }

    res.status(201).json({ message: "successfully saved to profile" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: error.message || "Error saving to profile" });
  }
};

const getTopStoriesForContest = async (req, res) => {
  const { id } = req.params;
  let { page, perPage, exclude_pagination } = req.query;

  // Ensure page has a default value if not provided
  page = +page || 1;
  perPage = +perPage || 5;

  const skip = (page - 1) * perPage;
  let stories = [];
  try {
    const total = await Story.countDocuments({
      contest: id,
      isTopWriting: true,
    });

    if (exclude_pagination === "true") {
      stories = await Story.find({
        contest: id,
        isTopWriting: true,
      })
        .sort({ score: -1 })
        .populate({
          path: "user",
          select: "-password", // Using a string for field exclusion
        });
    } else {
      stories = await Story.find({
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
    }

    return res.status(200).json({
      data: stories,
      ...(exclude_pagination !== "true"
        ? {
            pageData: {
              page,
              perPage,
              total,
            },
          }
        : {}),
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
    let responseData;
    const lastWeekContest = await Contest.find({
      isActive: false,
      // topWritingPublished: true,
    }).sort({
      createdAt: "descending",
    });

    const latestContest = lastWeekContest[0];
    console.log(latestContest._id);
    if (latestContest?.topWritingPublished) {
      const lastWeekContestTopStories = await Story.find({
        contest: latestContest._id,
        isTopWriting: true,
      })
        .populate({
          path: "user",
          select: "-password",
        })
        .sort({
          score: "desc",
        });
      console.log("stories", lastWeekContestTopStories.length);

      responseData = { data: lastWeekContestTopStories || [] };
      res.status(200).json(responseData);
    } else {
      responseData = {
        hasTopWritingPublished: false,
        writingPublishDate: latestContest?.topWritingPublishDate,
      };
      res.status(200).json(responseData);
    }
    await cacheService.set(cacheTypes.PREV_WEEK_TOP_STORIES, responseData);
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
  const { stories, title, iteration } = req.body;

  try {
    if (!stories || !title) {
      throw new Error("Stories and title are required");
    }
    if (stories.length < 2) {
      throw new Error("There must be at least 2 stories");
    }

    // Assuming emailServiceClass and gptService are correctly imported and instantiated
    const emailServiceIns = new emailServiceClass();
    const response = await gptService.rankStories(
      stories,
      title,
      iteration || Math.ceil(stories.length / 2)
    );

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Create a unique output file for storing the scores
    const outputFilePath = path.join(dataDir, `test-${Date.now()}.json`);

    // Write the response scores and aggregatedScores to the file
    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(
        {
          scores: response.scores,
          aggregatedScores: response.aggregatedScores,
        },
        null,
        4
      )
    );

    console.log("File written to:", outputFilePath);

    // Check if the file exists before attaching it
    if (!fs.existsSync(outputFilePath)) {
      throw new Error(`File does not exist: ${outputFilePath}`);
    }

    // Create email attachment
    const attachment = [
      {
        filename: path.basename(outputFilePath),
        path: outputFilePath, // Ensure the path is valid
      },
    ];

    // Configure the nodemailer transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465
      auth: {
        user: process.env.APP_EMAIL, // Sender's email address
        pass: process.env.SMTP_PW, // App-specific password
      },
    });

    console.log("Transporter created");

    // Mail options
    let mailOptions = {
      from: `"Writeasy" <${process.env.APP_EMAIL}>`,
      to: process.env.APP_EMAIL, // Sender's email for confirmation
      subject: "Story Ranking Results",
      text: "Please find the story ranking results attached.",
      html: "<h1>Story Ranking Results</h1><p>Find the results attached.</p>",
      attachments: attachment, // Attach the output file
    };

    // Send the email
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);

    try {
      fs.unlinkSync(outputFilePath);
    } catch (error) {
      console.log("error while deleting json file", error);
    }

    // Respond with success message
    // res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error in calculateTopWritings:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
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
