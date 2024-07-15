const Subscription = require("../models/subscription");
const User = require("../models/user");
const StripeService = require("../services/stripeService");
const createStripeCheckoutSession = async (req, res) => {
  const { user_id } = req.body;

  try {
    if (!user_id) {
      throw new Error("Please provide user id");
    }
    const checkoutRes = await StripeService.createStripeCheckout(user_id);
    const subscriptionExist = await Subscription.findOne({ userId: user_id });
    if (!subscriptionExist) {
      const userSubscription = new Subscription({
        stripe_session_id: checkoutRes.id,
        userId: user_id,
      });
      await userSubscription.save();
    } else {
      if (subscriptionExist.isActive) {
        throw new Error(
          "Failed to create checkout session. Your subscription is active !!"
        );
      }
      subscriptionExist.stripe_session_id = checkoutRes.id;
      await subscriptionExist.save();
    }
    return res.status(200).json({
      url: checkoutRes.url,
      success_url: checkoutRes.success_url,
      failure_url: checkoutRes.cancel_url,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

const confirmStripeCheckoutSession = async (req, res) => {
  const { stripe_session_id } = req.body;
  try {
    const session = await StripeService.confirmStripeCheckout(
      stripe_session_id
    );

    if (session.data?.payment_status !== "paid") {
      throw new Error("Payment failed ");
    }

    const subscriptionExist = await Subscription.findOne({
      stripe_session_id: stripe_session_id,
    });

    if (!subscriptionExist) {
      throw new Error("Subscription not found.");
    }

    const paidAt = new Date();
    const thirtyDaysLater = new Date(paidAt);
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

    await Subscription.updateOne(
      {
        stripe_session_id: stripe_session_id,
      },
      {
        $set: {
          paidAt,
          expiresAt: thirtyDaysLater,
          isActive: true,
        },
      }
    );

    await User.findByIdAndUpdate(subscriptionExist.userId, {
      subscriptionId: subscriptionExist._id,
    });
    return res.status(200).json({ message: "session confirmation success" });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

const PaymentController = {
  createStripeCheckoutSession,
  confirmStripeCheckoutSession,
};
module.exports = PaymentController;
