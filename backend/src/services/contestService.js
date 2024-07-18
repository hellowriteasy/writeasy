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

const getOngoingContests = async (skip, limit) => {
  const currentDateTime = new Date();
  const total = await Contest.countDocuments({
    isActive: true,
    submissionDeadline: { $gt: currentDateTime },
  });
  const data = await Contest.find(
    {
      isActive: true,
      promptPublishDate: { $lt: currentDateTime },
      submissionDeadline: { $gt: currentDateTime },
    },
    {},
    {
      ...(skip ? { skip } : null),
      ...(limit ? { limit } : null),
    }
  ).populate("prompts");
  return {
    total,
    data,
  };
};
const getEndedContests = async (skip, limit) => {
  const total = await Contest.countDocuments({
    isActive: false,
  });
  const data = await Contest.find(
    {
      isActive: false,
    },
    {},
    {
      ...(skip ? { skip } : null),
      ...(limit ? { limit } : null),
    }
  );
  return {
    total,
    data,
  };
};

module.exports = {
  createContest,
  getAllContests,
  updateContest,
  deleteContest,
  getContestById,
  getOngoingContests,
  getEndedContests,
};
