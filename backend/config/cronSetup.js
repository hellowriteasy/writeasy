const cron = require("node-cron");
const {
  updateUserPracticeLimits,
  checkSuspiciousUsers,
  scheduleJob,
} = require("./cron");

// Cron job setup
function setupCronJobs() {
  // Runs every 15 seconds for practice limits update
  cron.schedule("*/15 * * * * *", updateUserPracticeLimits);

  // Runs every 10 seconds to schedule job
  cron.schedule("*/10 * * * * *", scheduleJob);

  // Run every Sunday at 8 PM GMT to check suspicious users
  cron.schedule("0 20 * * 0", checkSuspiciousUsers);

  console.log("Cron jobs are set up and running...");
}

module.exports = setupCronJobs;
