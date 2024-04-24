const express = require("express");
const router = express.Router();
const {
  createContest,
  getContests,
  updateContest,
  deleteContest,
  getContest,
} = require("../src/controllers/contestController");

router.post("/", createContest);
router.get("/", getContests);
router.get("/:id", getContest);
router.put("/:id", updateContest);
router.delete("/:id", deleteContest);

module.exports = router;
