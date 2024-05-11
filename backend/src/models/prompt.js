const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  promptText: {
    type: String,
    required: true,
  },
  promptCategory: {
    type: String,
  },
  promptType: {
    type: String,
    enum: ["practicePrompt", "contestPrompt"],
    required: true, // Assuming each prompt must explicitly be identified as practice or contest
  },
});

const Prompt = mongoose.model("Prompt", promptSchema);

module.exports = Prompt;
