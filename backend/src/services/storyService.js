const mongoose = require("mongoose");
const Story = require("../models/story");

const createStory = async (data) => {
  const story = new Story(data);
  return await story.save();
};

const getAllStories = async (type, skip, limit) => {
  return await Story.find(
    {
      ...(type ? { storyType: type } : null),
    },
    {},
    {
      ...(limit ? { limit } : null),
      ...(skip ? { skip } : null),
    }
  )
    .populate({
      select: {
        password: 0,
      },
      model: "User",
      path: "user",
    })
    .populate({
      select: {
        password: 0,
      },
      path: "contributors",
    });
};

const getStoriesByUserAndType = async (userId, storyType, limit, skip) => {
  const objectId = new mongoose.Types.ObjectId(userId);
  const isPractiseStory = storyType === "practice";
  if (storyType === "practice" || storyType === "contest") {
    const total = await Story.countDocuments({
      user: objectId,
      storyType: storyType,
      ...(isPractiseStory ? { hasSaved: true } : null),
    });
    const data = await Story.find(
      {
        user: objectId,
        storyType: storyType,
        ...(isPractiseStory ? { hasSaved: true } : null),
      },
      {},
      {
        ...(limit ? { limit } : null),
        ...(skip ? { skip } : null),
      }
    )
      .populate("user")
      .populate("contest")
      .populate("prompt")
      .populate({
        path: "contributors",
        select: { password: 0 },
      })
      .sort({
        updatedAt: "desc",
      });
    return {
      data,
      total,
    };
  } else if (storyType === "game") {
    const total = await Story.countDocuments({
      storyType: "game",
      $or: [
        { user: objectId },
        {
          contributors: {
            $in: [objectId],
          },
        },
      ],
    });

    const data = await Story.find(
      {
        storyType: "game",
        $or: [
          { user: objectId },
          {
            contributors: {
              $in: [objectId],
            },
          },
        ],
      },
      {},
      {
        ...(limit ? { limit } : null),
        ...(skip ? { skip } : null),
      }
    )
      .populate("user")
      .populate("prompt")
      .populate("contest")
      .populate({
        path: "contributors",
        select: { password: 0 },
      });
    return {
      data,
      total,
    };
  } else {
    throw new Error("Invalid storyType");
  }
};

const getStoryById = async (storyId) => {
  return await Story.findById(storyId);
};

const updateStory = async (id, data) => {
  return await Story.findByIdAndUpdate(id, data, { new: true });
};

const deleteStory = async (id) => {
  return await Story.findByIdAndDelete(id);
};

const deleteStoriesByPromptId = async (prompt_id) => {
  return await Story.deleteMany({
    prompt: prompt_id,
  });
};

const getTopContestStories = async () => {
  const aWeekAgo = new Date();
  aWeekAgo.setDate(aWeekAgo.getDate() - 7); // Fetches the date 7 days prior from today

  const totalContestStories = await Story.countDocuments({
    storyType: "contest",
    submissionDateTime: {
      $gte: aWeekAgo, // Compares if the date of story submission falls in the last 7 days
    },
  });

  const top20PercentCount = Math.ceil(totalContestStories * 0.2);

  return await Story.find({
    storyType: "contest",
    submissionDateTime: {
      $gte: aWeekAgo, // Compares if the date of story submission falls in the last 7 days
    },
  })
    .sort({ score: -1 })
    .limit(top20PercentCount);
};
const getStoryofUserByPromptId = async (user_id, prompt_id) => {
  return await Story.findOne({
    prompt: prompt_id,
    $or: [
      {
        user: user_id,
      },
      {
        contributors: {
          $in: [user_id],
        },
      },
    ],
  })
    .populate("contributors")
    .populate("user");
};

module.exports = {
  createStory,
  getAllStories,
  updateStory,
  deleteStory,
  getStoryById,
  getTopContestStories,
  getStoriesByUserAndType,
  getStoryofUserByPromptId,
  deleteStoriesByPromptId,
};
