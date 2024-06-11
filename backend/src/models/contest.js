const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  prompts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prompt" }],
  contestTheme: { type: String, required: true },
  submissionDeadline: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});




// 5 june
// 7 june dead  isActive false
// 8
// 9 june
// functionToCloseTheContestWhenItDEad   false 



const Contest = mongoose.model("Contest", contestSchema);
module.exports = Contest;




