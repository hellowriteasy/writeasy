function calculateSubscriptionRemainingDays(startDate, endDate) {
  const currentDate = new Date();
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  // Check if subscription is active
  if (currentDate >= startDateObj && currentDate <= endDateObj) {
    // Calculate difference in milliseconds between current date and end date
    const differenceMs = endDateObj - currentDate;

    // Convert milliseconds to days
    const remainingDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return remainingDays;
  } else {
    return 0; // Return 0 if subscription is not active
  }
}

module.exports = {
  calculateSubscriptionRemainingDays,
};
