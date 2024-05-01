const GptService = require("../services/GptService");
const Story = require("../models/story");

const gptService = new GptService(process.env.GPT_API_KEY);

exports.scoreStory = async function (req, res) {
  const { userId, title, content, wordCount } = req.body;

  try {
    const score = await gptService.generateScore(content);

    const newStory = new Story({
      user: userId,
      title: title,
      content: content,
      wordCount: wordCount,
      score: score, // Save the score
      submissionDateTime: new Date(), // Optionally, set the date here
    });

    await newStory.save();

    return res.status(201).json({
      success: true,
      message: "Story scored and saved successfully",
      storyId: newStory._id,
      score: score,
    });
  } catch (error) {
    console.error("Failed to score and save story:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to score the story",
    });
  }
};
