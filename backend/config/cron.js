const Contest = require("../src/models/contest");
const Prompt = require("../src/models/prompt");
const Story = require("../src/models/story");
const Subscription = require("../src/models/subscription");
const stripe = require("./stripe");

async function scheduleJob() {
  await closeContestAfterDeadline();
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
                  const promptExist = await Prompt.findById(prompt_id);

                  if (!promptExist) {
                    console.log(`Prompt ${prompt_id} not found`);
                    return;
                  }

                  let stories = await Story.find({ prompt: prompt_id });

                  if (stories.length > 0) {
                    stories = stories.map((story) => ({
                      _id: story._id.toString(),
                      content: story.content,
                    }));

                    // Create the prompt
                    const prompt =
                      stories
                        .map((story) => `Story ${story._id}: ${story.content}`)
                        .join("\n\n") +
                      '\n\nEvaluate each story on a scale from 1 to 100 considering all the stories. Only return the scores in the format: [{_id: "story_id", score: score}].\n';

                    // API request
                    const response = await axios({
                      method: "post",
                      url: "https://api.openai.com/v1/chat/completions",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.GPT_API_KEY}`,
                      },
                      data: {
                        model: "gpt-4-turbo",
                        messages: [
                          {
                            role: "system",
                            content: `You are an assistant that evaluates ${promptExist.title} stories. For each story provided, rate its quality on a scale from 1 to 100 considering all the stories. Only return the scores in the format: [{_id: "story_id", score: score}].\n`,
                          },
                          {
                            role: "user",
                            content: `${prompt}`,
                          },
                        ],
                        max_tokens: 1500, // Adjust based on prompt length and expected response
                        temperature: 0.5,
                      },
                    });

                    // Check and parse response
                    if (
                      response.data.choices &&
                      response.data.choices.length > 0
                    ) {
                      let result;
                      try {
                        result = JSON.parse(
                          response.data.choices[0].message.content.trim()
                        );
                      } catch (parseError) {
                        console.error(
                          "Error parsing API response:",
                          parseError.message
                        );
                        return;
                      }

                      const topTwentyPercentWritings = getTopPercentage(
                        result,
                        20
                      );

                      await Promise.all(
                        topTwentyPercentWritings.map(
                          async (writing, position) => {
                            try {
                              await Story.findByIdAndUpdate(writing._id, {
                                position: position + 1,
                                score: writing.score,
                                isTopWriting: true,
                              });
                            } catch (updateError) {
                              console.error(
                                `Error updating story ${writing._id}:`,
                                updateError.message
                              );
                            }
                          }
                        )
                      );

                      console.log(
                        `Updated positions for top stories for prompt ${prompt_id}`
                      );
                    } else {
                      console.log(
                        `No valid response from API for prompt ${prompt_id}`
                      );
                    }
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
        await stripe.subscriptions.del(subscription.subscription_id);
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
