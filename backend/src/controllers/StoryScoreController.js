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
    if (storyType === "practice") {
      const existingPracticeStory = await Story.findOne({
        user: userId,
        prompt: prompt,
        storyType: "practice",
      });
      if (existingPracticeStory) {
        // Update the existing practice story
        existingPracticeStory.title = title;
        existingPracticeStory.content = content;
        existingPracticeStory.wordCount = wordCount;
        existingPracticeStory.hasSaved = true;
        existingPracticeStory.submissionDateTime = new Date();
        existingPracticeStory.hasSaved = !!hasSaved;

        // Get corrections and correction summary
        const corrections = await gptService.generateScore(
          existingPracticeStory.content,
          taskType,
          existingPracticeStory.wordCount
        );
        const correctionSummary = await gptService.generateCorrectionSummary(
          existingPracticeStory.content,
          corrections,
          0
        );
        // Update the existing practice story with corrections and correction summary
        existingPracticeStory.corrections = corrections.corrections;
        existingPracticeStory.correctionSummary = correctionSummary;
        existingPracticeStory.score = 0; // Score is set to 0 for practice stories

        const updatedPracticeStory = await existingPracticeStory.save();

        return res.status(200).json({
          success: true,
          message: "Practice story updated successfully",
          storyId: updatedPracticeStory._id,
          score: corrections.score,
          corrections: corrections.corrections,
          correctionSummary,
        });
      }
    }
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

    corrections = await gptService.generateScore(savedStory.content, taskType);
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
      savedStory.hasSaved = true;
    } else {
      const result = await gptService.generateScore(
        savedStory.content,
        taskType,
        wordCount
      );
      score = result.score;
      savedStory.score = score;
      savedStory.hasSaved = true;
    }

    await savedStory.save();

    return res.status(201).json({
      success: true,
      message: "Story scored and corrected successfully",
      storyId: savedStory._id,
      score: corrections.score,
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
