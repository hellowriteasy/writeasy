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
  authMiddleware,
  async (req, res) => {
    const { storyID, email } = req.body;
    try {
      const story = await CollaborativeStory.findById(storyID);
      if (!story) {
        console.log("Story not found with ID:", storyID);
        return res.status(404).json({ message: "Story not found." });
      }

      const user = await User.findOne({ email: email });
      if (!user) {
        console.log("User not found with email:", email);
        return res.status(404).json({ message: "User not found." });
      }

      const userId = user._id;
      if (!userId) {
        console.error("User ID is null for user with email:", email);
        return res
          .status(500)
          .json({ message: "Internal error: User ID is null." });
      }

      if (user.subscriptionType !== "paid") {
        return res
          .status(403)
          .json({ message: "User does not have a paid subscription." });
      }

      const isAlreadyContributor = story.contributors.some((contributorId) => {
        return contributorId && contributorId.toString() === userId.toString();
      });

      if (isAlreadyContributor) {
        res.status(400).json({ message: "User is already a contributor." });
      } else {
        story.contributors.push(userId);
        await story.save();
        res
          .status(200)
          .json({ message: "User invited successfully as contributor." });
      }
    } catch (error) {
      console.error("Error inviting collaborator:", error);
      res.status(500).json({ message: "Server error occurred." });
    }
  },
];

const submitCollaborativePart = [
  authMiddleware,
  checkInviteStatus,
  async (req, res) => {
    const { storyID, text } = req.body;
    const userID = req.user.id; // Using user id from auth token
    try {
      const story = await CollaborativeStory.findById(storyID);
      story.content.push({ author: userID, text, approved: false });
      await story.save();
      res.status(200).json({ message: "Story part submitted successfully." });
    } catch (error) {
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
