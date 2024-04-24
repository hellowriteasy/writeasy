const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema({
  promptText: {
    type: String,
    required: true,
  },
  promptCategory: {
    type: String,
  },
});

const Prompt = mongoose.model("Prompt", promptSchema);

module.exports = Prompt;
