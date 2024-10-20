const Story = require("../models/story");
const User = require("../models/user");
const GptService = require("../services/gptService");

const gptService = new GptService(process.env.GPT_API_KEY);

async function practiseStory(req, res) {
  const { content, taskType, userId, timezone, title, prompt } = req.body;
  const wordCount = content.split(" ").length; // Calculate word count
  const newStory = new Story({
    content: content,
    user: userId,
    title: title,
    storyType: "practice",
    prompt: prompt,
  });

  const userExist = await User.findById(userId);
  if (!userExist) {
    throw new Error("User not found");
  }

  if (userExist.practiceLimit <= 0) {
    return res.status(403).json({
      message: "No practice limit left for today. Try after 24 hours .",
    });
  }

  // Set headers for streaming data
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    let response = "";
    await gptService.generateScoreInChunk(
      content,
      taskType,
      wordCount,
      async (data, hasCompleted) => {
        if (!hasCompleted) {
          response += data;
          res.write(data); // Write data to the response stream as chunks
        } else {
          if (data !== null) {
            response += data;
          }

          console.log("ended", data);

          // Save the story and include the story ID in the final response
          newStory.corrections = response;
          await newStory.save();

          // Construct the final response with the last chunk of data and storyId
          res.write(
            JSON.stringify({
              data,
              storyId: newStory._id,
            })
          );

          // Call res.end() to indicate the stream has ended
          res.end();
          userExist.practiceLimit = userExist.practiceLimit - 1;
          userExist.timezone = timezone;
          await userExist.save();
          console.log(newStory._id);
        }
      }
    );
  } catch (error) {
    console.error("Failed to score story:", error);

    // End the response in case of error
    res.end(
      JSON.stringify({
        success: false,
        message: "Failed to score the story",
      })
    );
  }

  // Handle client disconnect
  req.on("close", () => {
    console.log("Client disconnected");
    res.end(); // Ensure the response is properly closed
  });
}

module.exports = {
  practiseStory,
};

// practise
// -correction
// save to profile
//  redirect to profile -> correction  - correction summary - save to profile
