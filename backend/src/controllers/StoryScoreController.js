const GptService = require("../services/gptService");
const Story = require("../models/story");

const gptService = new GptService(process.env.GPT_API_KEY);

exports.scoreStory = async function (req, res) {
  const { userId, title, content, taskType, storyType, prompt } = req.body;
  const wordCount = content.split(" ").length; // Calculate word count

  try {
    // Save the new story to the database without score and corrections
    const newStory = new Story({
      user: userId,
      title: title,
      content: content,
      wordCount: wordCount,
      submissionDateTime: new Date(),
      storyType: storyType,
      prompt: prompt,
    });

    const savedStory = await newStory.save();

    // Call the GPT service to score and correct the story synchronously
    const { score, corrections } = await gptService.generateScore(
      savedStory.content,
      taskType,
      wordCount 
    );

    const correctionSummary = await gptService.generateCorrectionSummary(
      savedStory.content,
      corrections,
      score
    );

    // Update the story with the score, corrections, and correction summary
    savedStory.score = score;
    savedStory.corrections = corrections;
    savedStory.correctionSummary = correctionSummary;
    
    await savedStory.save();

    return res.status(201).json({
      success: true,
      message: "Story scored and corrected successfully",
      storyId: savedStory._id,
      score,
      corrections,
      correctionSummary
    });
  } catch (error) {
    console.error("Failed to score story:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to score the story",
    });
  }
};