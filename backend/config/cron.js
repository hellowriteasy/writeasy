const Contest = require("../src/models/contest");
const Story = require("../src/models/story");

async function scheduleJob() {
  await closeContestAfterDeadline();
}

const closeContestAfterDeadline = async () => {
  const todayTime = new Date().getTime();
  try {
    const endedContests = await Contest.find({
      isActive: true,
      submissionDeadline: { $lt: todayTime },
    });

    if (endedContests.length > 0) {
      console.log("Ending contests...");

      await Promise.all(
        endedContests.map(async (contest) => {
          try {
            await Promise.all(
              contest.prompts.map(async (prompt_id) => {
                try {
                  const stories = await Story.find({ prompt: prompt_id }).sort({
                    score: -1,
                  });

                  if (stories.length > 0) {
                    const topStoriesCount = Math.ceil(stories.length * 0.2);

                    await Promise.all(
                      stories
                        .slice(0, topStoriesCount)
                        .map(async (story, index) => {
                          story.position = index + 1;
                          await story.save();
                        })
                    );

                    console.log(
                      `Updated positions for top ${topStoriesCount} stories for prompt ${prompt_id}`
                    );
                  } else {
                    console.log(`No stories found for prompt ${prompt_id}`);
                  }
                } catch (error) {
                  console.error(
                    `Error updating stories for prompt ${prompt_id}:`,
                    error
                  );
                }
              })
            );

            contest.isActive = false;
            await contest.save();
            console.log(`Contest ${contest._id} ended successfully`);
          } catch (error) {
            console.error(`Error processing contest ${contest._id}:`, error);
          }
        })
      );
    } 

    console.log("Cron job finished");
  } catch (error) {
    console.error("Error while closing contests Cron Job:", error.message);
  }
};

module.exports = scheduleJob;
