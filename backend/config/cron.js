const Contest = require("../src/models/contest");
const Prompt = require("../src/models/prompt");
const Story = require("../src/models/story");
const Subscription = require("../src/models/subscription");
const stripe = require("./stripe");
const gptServiceClass = require("../src//services/gptService");
const gptService = new gptServiceClass(process.env.GPT_API_KEY);
async function scheduleJob() {
  await closeContestAndChooseTopWritingAfterDeadline();
  await closeSubscriptionWhenDeadline();
  await publishWritingsAfterPromptPublishDate();
}
const getTopPercentage = (array, percentage) => {
  // Sort the array by score in descending order
  const sortedArray = array.sort((a, b) => b.score - a.score);

  // Calculate the number of items to include (20% of the array)
  const topCount = Math.ceil((percentage / 100) * sortedArray.length);

  // Return the top percentage of items
  return sortedArray.slice(0, topCount);
};

const closeContestAndChooseTopWritingAfterDeadline = async () => {
  const todayTime = new Date().getTime();

  try {
    const endedContests = await Contest.find({
      isActive: true,
      startedScoringStories: false,
      submissionDeadline: { $lt: todayTime },
    });

    if (endedContests.length > 0) {
      console.log("Ending contests...");

      await Promise.all(
        endedContests.map(async (contest) => {
          contest.startedScoringStories = true;
          contest.isActive = false;
          let iteration = contest.comparisionCount;
          await contest.save();
          try {
            await Promise.all(
              contest.prompts.map(async (prompt_id) => {
                try {
                  const promptExist = await Prompt.findById(prompt_id);

                  if (!promptExist) {
                    console.log(`Prompt ${prompt_id} not found`);
                    return;
                  }

                  let stories = await Story.find({
                    prompt: prompt_id,
                  }).populate("user");

                  if (stories.length > 0) {
                    stories = stories.map((story) => ({
                      _id: story._id.toString(),
                      content: story.content,
                      email: story.user?.email || "",
                    }));
                    if (!iteration) {
                      iteration = Math.ceil(stories.length / 2);
                    }
                    const topStories = await gptService.rankStories(
                      stories,
                      promptExist.title,
                      iteration,
                      contest.topWritingPercent || 50
                    );

                    await Promise.all(
                      Object.entries(topStories.aggregatedScores).map(
                        async ([storyId]) => {
                          const story = await Story.findById(storyId);
                          if (story) {
                            console.log("updating story", storyId);
                            story.isTopWriting = true;
                            await story.save();
                          }
                        }
                      )
                    );

                    console.log(
                      `Stories ranked for prompt ${prompt_id},${topStories.toString()}`
                    );
                  } else {
                    console.log(`No stories found for prompt ${prompt_id}`);
                  }
                } catch (error) {
                  console.error(
                    `Error processing stories for prompt ${prompt_id}:`,
                    error.message
                  );
                }
              })
            );

            contest.isActive = false;
            await contest.save();
            console.log(`Contest ${contest._id} ended successfully`);
          } catch (error) {
            console.error(
              `Error processing contest ${contest._id}:`,
              error.message
            );
          }
        })
      );
    }
    console.log("Cron job finished");
  } catch (error) {
    console.error("Error while closing contests Cron Job:", error.message);
  }
};

const publishWritingsAfterPromptPublishDate = async () => {
  try {
    const currentDate = new Date();
    const contests = await Contest.updateMany(
      {
        isActive: false,
        topWritingPublished: false,
        topWritingPublishDate: { $lt: currentDate },
      },
      {
        topWritingPublished: true,
      }
    );

    if (contests.modifiedCount > 0) {
      console.log("Prompt published ", contests.modifiedCount);
    }
  } catch (er) {
    console.log("error while publishing prompt", er);
    //
  }
};

const closeSubscriptionWhenDeadline = async () => {
  try {
    const currentDate = new Date();

    // Fetch subscriptions to update
    const subscriptionsToUpdate = await Subscription.find({
      expiresAt: { $lt: currentDate },
      isActive: true,
    });

    // Iterate through each subscription to update and delete from Stripe
    for (let subscription of subscriptionsToUpdate) {
      // Delete the subscription from Stripe
      if (subscription.subscription_id) {
        console.log("subscriptionId", subscription.subscription_id);
        await stripe.subscriptions.cancel(subscription.subscription_id);
      }
      // Update the subscription in your database
      subscription.isActive = false;
      await subscription.save();
    }

    if (subscriptionsToUpdate.length > 0) {
      console.log("Subscriptions closed and deleted from Stripe");
    }
  } catch (error) {
    console.log("Cron job: error while closing subscriptions", error);
  }
};

module.exports = { getTopPercentage };
module.exports = scheduleJob;
