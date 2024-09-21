const Contest = require("../models/contest");

const createContest = async (data) => {
  const contest = await Contest.create(data);
  return contest;
};

const getAllContests = async () => {
  return await Contest.find().sort({ createdAt: "desc" }).populate("prompts");
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
      sort: {
        createdAt: "desc",
      },
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
  ).sort({ createdAt: "desc" });
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
