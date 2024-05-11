const GptService = require("../services/GptService");
const Story = require("../models/story");

const gptService = new GptService(process.env.GPT_API_KEY);

exports.scoreStory = async function (req, res) {
  const { userId, title, content, taskType, storyType, prompt } = req.body;
  // Calculate word count
  const wordCount = content.split(" ").length;

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

    scoreAndCorrectStoryInBackground(savedStory._id);

    return res.status(201).json({
      success: true,
      message: "Story submitted and scoring in progress",
      storyId: savedStory._id,
    });
  } catch (error) {
    console.error("Failed to save story:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save the story",
    });
  }
};

async function scoreAndCorrectStoryInBackground(storyID) {
  try {
    const story = await Story.findById(storyID);
    if (!story) {
      console.error(`Failed to find story: ${storyID}`);
      return;
    }

    const { score, corrections } = await gptService.generateScore(
      story.content,
      story.taskType
    );

    story.score = score;
    story.corrections = corrections; // update corrections

    await story.save();
    console.log("Story scored and corrected successfully");
  } catch (err) {
    console.error(`Failed to score and correct story: ${storyID}`, err);
  }
}
