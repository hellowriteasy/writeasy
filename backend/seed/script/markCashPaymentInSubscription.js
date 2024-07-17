const Subscription = require("../../src/models/subscription");

async function markCashPaymentInSubscription() {
  try {
    await Subscription.updateMany(
      {
        stripe_session_id: "test",
      },
      {
        $set: {
          payment_type: "cash_payment",
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = markCashPaymentInSubscription;
