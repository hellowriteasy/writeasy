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
  console.log("score story", req.body);
  const { userId, title, content, taskType, storyType, prompt, hasSaved } =
    req.body;
  console.log(content);

  const wordCount = content.split(" ").length; // Calculate word count
  let corrections = null;
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
          res.end();

          corrections = await gptService.generateScore(
            content,
            taskType,
            wordCount
          );

          if (hasSaved) {
            const newStory = new Story({
              user: userId,
              title: title || "",
              content: content,
              wordCount: wordCount,
              submissionDateTime: new Date(),
              storyType: storyType,
              prompt: prompt,
              hasSaved: true,
            });
            await newStory.save();
            processGeneratingCorrectionSummary({
              story_id: newStory._id,
              corrections: corrections.corrections,
              score: corrections.score,
              content,
            });
          }
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
  scoreStory,
};
