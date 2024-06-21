const GptService = require("../services/gptService");
const Story = require("../models/story");

const gptService = new GptService(process.env.GPT_API_KEY);

exports.scoreStory = async function (req, res) {
  const { userId, title, content, taskType, storyType, prompt, hasSaved } =
    req.body;
  const wordCount = content.split(" ").length; // Calculate word count
  let score = 0;
  let corrections = null;
  let correctionSummary = null;
  try {
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
    corrections = await gptService.generateScore(
      savedStory.content,
      taskType,
      wordCount
    );
    correctionSummary = await gptService.generateCorrectionSummary(
      savedStory.content,
      corrections.corrections,
      corrections.score
    );
    if (storyType === "practice") {
      savedStory.score = 0;
      savedStory.corrections = corrections.corrections;
      savedStory.correctionSummary = correctionSummary;
      savedStory.hasSaved = !!hasSaved;
    }
    if (storyType !== "practice") {
      savedStory.hasSaved = false;
    }
    await savedStory.save();
    return res.status(201).json({
      success: true,
      message: "Story scored and corrected successfully",
      storyId: savedStory._id,
      corrections: corrections.corrections,
      correctionSummary,
    });
  } catch (error) {
    console.error("Failed to score story:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to score the story",
    });
  }
};
