const GptService = require("../services/gptService");

const gptService = new GptService(process.env.GPT_API_KEY);

async function practiseStory(req, res) {
  const {content, taskType } =
    req.body;

  const wordCount = content.split(" ").length; // Calculate word count
  try {

    await gptService.generateScoreInChunk(
      content,
      taskType,
      wordCount,
      async (data, hasCompleted) => {
        if (!hasCompleted) {
          res.write(data);
        } else {
          console.log("ended", data);
          res.end(data);
        }
      }
    );
  } catch (error) {
    console.error("Failed to score story:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to score the story",
    });
  }
}

module.exports = {
  practiseStory,
};



// practise 
// -correction 
// save to profile 
//  redirect to profile -> correction  - correction summary - save to profile