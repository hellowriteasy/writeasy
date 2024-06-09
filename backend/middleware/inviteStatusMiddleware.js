const User = require("../src/models/user");
const CollaborativeStory = require("../src/models/collaborativeStory");
const Story = require("../src/models/story");

// Function to check paid status for any given user ID
const checkPaidStatusForUserId = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || user.subscriptionType !== "paid") {
      return { isPaid: false, error: null };
    }
    return { isPaid: true, error: null };
  } catch (error) {
    return { isPaid: false, error: error };
  }
};

// Middleware to check if the logged-in user is a paid user
const checkPaidStatus = async (req, res, next) => {
  const { isPaid, error } = await checkPaidStatusForUserId(req.user.id);
  if (error) {
    console.error("Error checking paid status:", error);
    return res.status(500).json({ msg: "Failed to check paid status" });
  }
  if (!isPaid) {
    return res.status(403).json({ msg: "Access restricted to paid users." });
  }
  next();
};

// Middleware to check if the invited user is a paid user
const checkPaidStatusForInvited = async (req, res, next) => {
  const { isPaid, error } = await checkPaidStatusForUserId(req.body.userID);
  if (error) {
    console.error("Error checking invited user's paid status:", error);
    return res
      .status(500)
      .json({ msg: "Failed to verify invited user's paid status" });
  }
  if (!isPaid) {
    return res.status(403).json({ msg: "You can't invite a non-paid user." });
  }
  next();
};

// Middleware to check if the submitting user is the creator or a contributor
const checkInviteStatus = async (req, res, next) => {
  const userId = req.user.id; // Assuming 'req.user' is populated by preceding authentication middleware
  const storyId = req.body.storyID; // Assuming the story ID is part of the request body

  try {
    const story = await Story.findById(storyId)

    if (!story) {
      return res.status(404).json({ msg: "Story not found." });
    }

    // Check if the user is the creator or a contributor
    const isCreator =
      story.user && story.user._id.toString() === userId;
    
    const isContributor = story.contributors.some(
      (contributor) => contributor._id.toString() === userId
    );

    if (isCreator || isContributor) {
      next();
    } else {
      res
        .status(403)
        .json({
          msg: "User is not authorized to submit a part in this story.",
        });
    }
  } catch (error) {
    console.error("Error in checkInviteStatus middleware:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  checkPaidStatus,
  checkPaidStatusForInvited,
  checkInviteStatus,
};
