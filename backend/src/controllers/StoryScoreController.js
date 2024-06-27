const GptService = require("../services/gptService");
const Story = require("../models/story");

const gptService = new GptService(process.env.GPT_API_KEY);

async function processGeneratingCorrectionSummary({
  story_id,
  corrections,
  score,
  content,
}) {
  try {
    console.log("started generating correction summary for story ", story_id);
    const correctionSummary = await gptService.generateCorrectionSummary(
      content,
      corrections,
      score
    );
    console.log("completed generating correction summary for story ", story_id);
    await Story.findByIdAndUpdate(story_id, {
      $set: {
        correctionSummary,
      },
    });
  } catch (error) {
    console.log("error generating correction summary", error);
  }
  //
}

async function scoreStory(req, res) {
  const { userId, title, content, taskType, storyType, prompt, hasSaved } =
    req.body;
  const wordCount = content.split(" ").length; // Calculate word count
  let corrections = null;
  let correctionSummary = "";
  try {
    const newStory = new Story({
      user: userId,
      title: title || "",
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
    if (storyType === "practice") {
      savedStory.score = 0;
      savedStory.hasSaved = !!hasSaved;
    }
    if (storyType !== "practice") {
      savedStory.hasSaved = false;
    }
    await savedStory.save();
    res.status(201).json({
      success: true,
      message: "Story scored and corrected successfully",
      storyId: savedStory._id,
      corrections: corrections.corrections,
      correctionSummary,
    });
    processGeneratingCorrectionSummary({
      story_id: savedStory._id,
      corrections: corrections.corrections,
      score: corrections.score,
      content,
    });
  } catch (error) {
    console.error("Failed to score story:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to score the story",
    });
  }
}

module.exports = {
  scoreStory,
};
