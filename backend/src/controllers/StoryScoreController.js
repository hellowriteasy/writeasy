const Story = require("../models/story");
const GptService = require("../services/gptService");

const gptService = new GptService(process.env.GPT_API_KEY);

async function practiseStory(req, res) {
  const { content, taskType, userId, title, prompt } = req.body;

  const wordCount = content.split(" ").length; // Calculate word count

  const newStory = new Story({
    content: content,
    user: userId,
    title: title,
    storyType: "practice",
    prompt: prompt,
  });

  try {
    let response = "";
    await gptService.generateScoreInChunk(
      content,
      taskType,
      wordCount,
      async (data, hasCompleted) => {
        if (!hasCompleted) {
          response += data;
          res.write(data); // Write data to the response stream
        } else {
          if (data !== null) {
            response += data;
          }
          console.log("ended", data);

          // Save the story and include the story ID in the final response
          newStory.corrections = response;
          await newStory.save();

          // Construct the final response, including the last piece of data and the storyId
          res.end(
            JSON.stringify({
              data,
              storyId: newStory._id,
            })
          );

          console.log(newStory._id);
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
