const Contest = require("../src/models/contest");

async function scheduleJob() {
  await closeContestAfterDeadline();
}

const closeContestAfterDeadline = async () => {
  const todayTime = new Date().getTime();
  try {
    const updateResult = await Contest.updateMany(
      {
        isActive: true,
        submissionDeadline: { $lt: todayTime },
      },
      {
        $set: {
          isActive: false,
        },
      }
    );
    if (updateResult.modifiedCount) {
      console.log(
        "Cron Job - Contest deactivated after the submission deadline is crossed."
      );
    }
  } catch (error) {
    console.log(error);
    console.log(`Error while closing the contest Cron Job `, error?.message);
  }
};

module.exports = scheduleJob;
