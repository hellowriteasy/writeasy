const GptService = require("../services/gptService");
const Story = require("../models/story");

const gptService = new GptService(process.env.GPT_API_KEY);

exports.scoreStory = async function (req, res) {
  const { userId, title, content, taskType, storyType, prompt } = req.body;
  const wordCount = content.split(" ").length; // Calculate word count

  try {
    // Check if a practice story exists for the same user and prompt
    if (storyType === "practice") {
      const existingPracticeStory = await Story.findOne({ user: userId, prompt: prompt, storyType: "practice" });

      if (existingPracticeStory) {
        // Update the existing practice story
        existingPracticeStory.title = title;
        existingPracticeStory.content = content;
        existingPracticeStory.wordCount = wordCount;
        existingPracticeStory.submissionDateTime = new Date();

        // Get corrections and correction summary
        const corrections = await gptService.generateCorrections(existingPracticeStory.content, taskType);
        const correctionSummary = await gptService.generateCorrectionSummary(existingPracticeStory.content, corrections, 0);

        // Update the existing practice story with corrections and correction summary
        existingPracticeStory.corrections = corrections;
        existingPracticeStory.correctionSummary = correctionSummary;
        existingPracticeStory.score = 0; // Score is set to 0 for practice stories

        const updatedPracticeStory = await existingPracticeStory.save();

        return res.status(200).json({
          success: true,
          message: "Practice story updated successfully",
          storyId: updatedPracticeStory._id,
          score: 0,
          corrections,
          correctionSummary
        });
      }
    }

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

    let score = 0;
    let corrections = null;
    let correctionSummary = null;

    // Generate corrections for all story types
    corrections = await gptService.generateCorrections(savedStory.content, taskType);
    correctionSummary = await gptService.generateCorrectionSummary(savedStory.content, corrections, score);

    if (storyType !== "practice") {
      // Call the GPT service to score the story
      const result = await gptService.generateScore(savedStory.content, taskType, wordCount);
      score = result.score;
      savedStory.score = score;
    } else {
      savedStory.score = 0; // Score is set to 0 for practice stories
    }

    // Update the story with the score, corrections, and correction summary
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
