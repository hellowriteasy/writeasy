const GptService = require("../services/GptService");
const Story = require("../models/story");

const gptService = new GptService(process.env.GPT_API_KEY);

exports.scoreStory = async function (req, res) {
  const { userId, title, content, taskType, storyType, prompt } = req.body;
  // Calculate word count
  const wordCount = content.split(" ").length;

  try {
    const { score, corrections } = await gptService.generateScore(
      content,
      taskType
    );

    const newStory = new Story({
      user: userId,
      title: title,
      content: content,
      wordCount: wordCount,
      score: score,
      submissionDateTime: new Date(),
      corrections: corrections, // Save corrections
      storyType: storyType,
      prompt: prompt,
    });

    await newStory.save();

    return res.status(201).json({
      success: true,
      message: "Story scored, corrected, and saved successfully",
      storyId: newStory._id,
      score: score,
      corrections: corrections,
    });
  } catch (error) {
    console.error("Failed to score, correct, and save story:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to score and process the story",
    });
  }
};
