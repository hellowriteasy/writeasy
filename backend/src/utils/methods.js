function calculateSubscriptionRemainingDays(expiresAt) {
  if (!expiresAt) return 0;
  // Get the current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceInTime = new Date(expiresAt) - currentDate;

  // Convert the difference from milliseconds to days (1 day = 86400000 ms)
  const remainingDays = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

  return remainingDays > 0 ? remainingDays : 0; // Return 0 if the subscription has already expired
}

module.exports = {
  calculateSubscriptionRemainingDays,
};
