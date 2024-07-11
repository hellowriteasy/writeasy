const Prompt = require("../models/prompt");
const Story = require("../models/story");

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
    await Prompt.deleteMany({
      contestId: req.params.id,
    });
    await Story.deleteMany({
      contest: req.params.id,
    });
    await res.status(204).json({ message: "Contest deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOngoingContests = async (req, res) => {
  const page = req.query.page || 1; // Default page is 1
  const perPage = req.query.perPage || 5; // Default page size is 10
  const skip = (page - 1) * perPage;
  const limit = +perPage || 5;
  try {
    const { data, total } = await ContestService.getOngoingContests(
      skip,
      limit
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
    res.status(500).json({ message: error.message });
  }
};

const getEndedContests = async (req, res) => {
  
  const page = req.query.page || 1; // Default page is 1
  const perPage = req.query.perPage || 5; // Default page size is 10
  const skip = (page - 1) * perPage;
  const limit = +perPage || 5;

  try {

    const { data, total } = await ContestService.getEndedContests(skip, limit);

    res.json({
      data,
      pageData: {
        page,
        perPage,
        total,
      },
    });

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
  getEndedContests,
};
