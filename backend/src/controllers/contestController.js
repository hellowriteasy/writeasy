const Prompt = require("../models/prompt");
const ContestService = require("../services/contestService");

const createContest = async (req, res) => {
  try {
    const contest = await ContestService.createContest(req.body);
    await Prompt.updateMany(
      {
        _id: { $in: contest.prompts },
      },
      {
        contestId: contest._id,
      }
    );
    res.status(201).json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContests = async (req, res) => {
  try {
    const contests = await ContestService.getAllContests();
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContest = async (req, res) => {
  const contestId = req.params.id;
  try {
    const contest = await ContestService.getContestById(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateContest = async (req, res) => {
  try {
    const updatedContest = await ContestService.updateContest(
      req.params.id,
      req.body
    );
    res.json(updatedContest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteContest = async (req, res) => {
  try {
    await ContestService.deleteContest(req.params.id);
    res.status(204).json({ message: "Contest deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOngoingContests = async (req, res) => {
  try {
    const ongoingContests = await ContestService.getOngoingContests();
    res.json(ongoingContests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createContest,
  getContests,
  updateContest,
  deleteContest,
  getContest,
  getOngoingContests,
};
