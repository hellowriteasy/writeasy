const express = require("express");
const router = express.Router();
const {
  createPrompt,
  getPrompts,
  updatePrompt,
  deletePrompt,
  getPrompt,
} = require("../src/controllers/promptController");

router.post("/", createPrompt);
router.get("/", getPrompts);
router.get("/:id", getPrompt);
router.put("/:id", updatePrompt);
router.delete("/:id", deletePrompt);

module.exports = router;
