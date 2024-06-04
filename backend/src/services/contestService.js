const Contest = require("../models/contest");

const createContest = async (data) => {
  const contest = new Contest(data);
  return await contest.save();
};

const getAllContests = async () => {
  return await Contest.find().populate("prompts");
};

const getContestById = async (contestId) => {
  return await Contest.findById(contestId).populate("prompts");
};

const updateContest = async (id, data) => {
  return await Contest.findByIdAndUpdate(id, data, { new: true });
};

const deleteContest = async (id) => {
  return await Contest.findByIdAndDelete(id);
};

const getOngoingContests = async () => {
  const currentDateTime = new Date();
  return await Contest.find({
    isActive: true,
    submissionDeadline: { $gt: currentDateTime },
  }).populate("prompts");
};

module.exports = {
  createContest,
  getAllContests,
  updateContest,
  deleteContest,
  getContestById,
  getOngoingContests,
};
