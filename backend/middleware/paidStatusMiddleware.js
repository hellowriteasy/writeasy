const User = require("../src/models/user");

// Check paid status for a given user ID
const checkPaidStatusForUserId = async (userId) => {
  const user = await User.findById(userId);
  if (!user || user.subscriptionType !== "paid") {
    return false; // User is not paid or does not exist
  }
  return true;
};

exports.checkPaidStatus = async (req, res, next) => {
  if (await checkPaidStatusForUserId(req.user.id)) {
    next();
  } else {
    res.status(403).json({ msg: "Access restricted to paid users." });
  }
};

exports.checkPaidStatusForInvited = async (req, res, next) => {
  if (await checkPaidStatusForUserId(req.body.userID)) {
    next();
  } else {
    res.status(403).json({ msg: "You can't invite a non-paid user." });
  }
};
