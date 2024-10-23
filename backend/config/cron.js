const Contest = require("../src/models/contest");
const Prompt = require("../src/models/prompt");
const Story = require("../src/models/story");
const Subscription = require("../src/models/subscription");
const stripe = require("./stripe");
const gptServiceClass = require("../src//services/gptService");
const User = require("../src/models/user");
const gptService = new gptServiceClass(process.env.GPT_API_KEY);
const moment = require("moment-timezone");
const siteConfigModel = require("../src/models/app");
const StripeService = require("../src/services/stripeService");
const LoginHistory = require("../src/models/session");
const createJSONFile = require("../utils/methods");
const emailService = require("../src/services/emailService");
async function scheduleJob() {
  await closeContestAndChooseTopWritingAfterDeadline();
  await closeSubscriptionWhenDeadline();
  await publishWritingsAfterPromptPublishDate();
}

const getTopPercentage = (array, percentage) => {
  const sortedArray = array.sort((a, b) => b.score - a.score);

  const topCount = Math.ceil((percentage / 100) * sortedArray.length);

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
                            story.score = topStories.aggregatedScores[storyId];
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
        await StripeService.deleteSubscription(subscription.subscription_id);
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

// Fetch site practise limit from config
async function getSitePractiseLimit() {
  const config = await siteConfigModel.findOne();
  return config ? config.sitePractiseLimit : 5; // Default to 5 if no config is found
}

// Function to update user's practice limit
async function updateUserPracticeLimits() {
  console.log("************ updating user practice limits ************");

  // Get current sitePractiseLimit
  const sitePractiseLimit = await getSitePractiseLimit();
  const users = await User.find({
    practiceLimit: { $ne: sitePractiseLimit },
  });

  if (!users || users.length === 0) {
    console.log("No users found with timezones.");
    return;
  }

  for (const user of users) {
    const currentUserTimezone = user.timezone || "UTC";
    const currentTimeInUserTimezone = moment.tz(currentUserTimezone);
    // Check if it's midnight for the user
    if (currentTimeInUserTimezone.format("HH:mm") === "00:00") {
      // Reset practiceLimit to sitePractiseLimit
      user.practiceLimit = sitePractiseLimit;
      await user.save();
      console.log(`Reset practice limit for user: ${user.username}`);
    } else {
      console.log(`No need to reset practice limit for user: ${user.username}`);
    }
  }
}

async function checkSuspiciousUsers() {
  console.log("************ checking for suspicious users ************");
  try {
    // Find all login histories where hasChecked is false
    const unCheckedLogins = await LoginHistory.find({ hasChecked: false });

    // Group logins by userId and count distinct IP addresses
    const userLogins = {};
    unCheckedLogins.forEach((login) => {
      if (!userLogins[login.userId]) {
        userLogins[login.userId] = { ips: new Set(), logins: [] };
      }
      userLogins[login.userId].ips.add(login.ip);
      userLogins[login.userId].logins.push(login);
    });

    // Array to store suspicious users data
    const suspiciousData = [];

    // Iterate through each user and check if they have more than 3 distinct IP addresses
    for (const userId in userLogins) {
      if (userLogins[userId].ips.size > 3) {
        suspiciousData.push({
          userId,
          loginHistory: userLogins[userId].logins,
        });
      }
    }
    await LoginHistory.updateMany({ hasChecked: false }, { hasChecked: true });

    if (suspiciousData.length) {
      const outputFilePath = await createJSONFile(
        `${suspiciousData.length}-suspiciousUsers`,
        suspiciousData
      );
      const attachment = [
        {
          filename: path.basename(outputFilePath),
          path: outputFilePath,
        },
      ];

      // Create an instance of the email service
      const emailServiceIns = new emailService();
      // Send the email with the attachment
      await emailServiceIns.sendEmail({
        subject: `Suspicous Users - ${new Date().toUTCString()}`,
        attachment,
        email: [process.env.APP_EMAIL],
        message: `There are ${suspiciousData.length} suspicious users in last 7 days. Found in the system. Please check the attachment for more information.`,
      });
    } else {
      const emailServiceIns = new emailService();

      await emailServiceIns.sendEmail({
        subject: `No Suspicious Users - ${new Date().toUTCString()}`,
        email: [process.env.APP_EMAIL],
        message: `There are no suspicious users in last 7 days.`,
      });
    }
  } catch (error) {
    console.error("Error checking suspicious users:", error);
  }
}

module.exports = {
  getTopPercentage,
  updateUserPracticeLimits,
  scheduleJob,
  checkSuspiciousUsers,
};
