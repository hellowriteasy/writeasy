const CollaborativeStory = require("../models/collaborativeStory");
const { authMiddleware } = require("../../middleware/authMiddleware");
const { checkPaidStatus } = require("../../middleware/paidStatusMiddleware");
const User = require("../models/user");
const {
  checkPaidStatusForInvited,
} = require("../../middleware/paidStatusMiddleware");

const {
  checkInviteStatus,
} = require("../../middleware/inviteStatusMiddleware");
const Story = require("../models/story");
const GptService = require("../services/gptService");

const gptService = new GptService(process.env.GPT_API_KEY);

const getCollaborativeStories = async (req, res) => {
  try {
    const stories = await CollaborativeStory.find({})
      .populate("creatorUser")
      .populate("contributors");
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCollaborativeStory = [
  // authMiddleware,
  checkPaidStatus,
  async (req, res) => {
    const { title } = req.body;
    const creatorUser = req.user.id; // Using user id from auth token
    try {
      const newStory = new CollaborativeStory({
        title,
        description,
        creatorUser,
        content: [],
        contributors: [],
      });
      await newStory.save();
      res.status(201).json(newStory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

const inviteCollaborators = [
  // authMiddleware,
  async (req, res) => {
    let { storyID, email, promptID, userID } = req.body;
    let story;
    try {
      if (storyID) {
        story = await Story.findById(storyID).populate("contributors");
        if (!story) {
          console.log("Story not found with ID:", storyID);
          return res.status(404).json({ message: "Story not found." });
        }
      } else {
        story = await Story.create({
          prompt: promptID,
          storyType: "game",
          user: userID,
        });

        await story.populate({
          path: "contributors.subscriptionId",
          model: "Subscription",
        });
      }

      const newContributorUsers = await User.find({
        email: {
          $in: email,
        },
      }).populate({
        path: "subscriptionId",
        model: "Subscription",
      });

      if (newContributorUsers.length !== email.length) {
        return res.status(400).json({
          message:
            "Please check the email is valid . Some of the user not found with given email. ",
        });
      }


      if (
        newContributorUsers.some(
          (user) => user.subscriptionId?.isActive !== true
        )
      ) {
        throw new Error("Invited user is not a paid user");
      }

      const isAlreadyContributor = story.contributors.some((contributorId) => {
        return newContributorUsers.some(
          (user) => user._id.toString() === contributorId.toString()
        );
      });

      if (isAlreadyContributor) {
        return res.status(400).json({
          message: "One of the user of these email is already a contributor.",
        });
      }
      story.contributors.push(
        ...newContributorUsers.map((user) => user._id.toString())
      );
      await story.save();

      res
        .status(200)
        .json({ message: "User invited successfully as contributor." });
    } catch (error) {
      console.error("Error inviting collaborator:", error);
      res
        .status(500)
        .json({ message: error.message || "Server error occurred." });
    }
  },
];

const submitCollaborativePart = [
  // authMiddleware,
  // checkInviteStatus,
  async (req, res) => {
    const { storyID, text, title } = req.body;
    const wordCount = text.split(" ").length; // Calculate word count
    // const userID = req.user.id; // Using user id from auth token
    try {
      const story = await Story.findById(storyID);
      if (!story) {
        return res.status(404).json({ message: "Story not found." });
      }
      story.content = text;
      const correctionRes = await gptService.generateScore(
        text,
        "grammar",
        wordCount
      );

      const correctionSummary = await gptService.generateCorrectionSummary(
        text,
        correctionRes.corrections,
        0
      );

      story.correctionSummary = correctionSummary;
      story.corrections = correctionRes.corrections;
      story.title = title;

      await story.save();
      res.status(200).json({ message: "Story part submitted successfully." });
    } catch (error) {
      console.log("Error submitting story part:", error);
      res.status(500).json({ message: error.message });
    }
  },
];

module.exports = {
  getCollaborativeStories,
  createCollaborativeStory,
  inviteCollaborators,
  submitCollaborativePart,
};
