const stripe = require("../../config/stripe");
const Subscription = require("../models/subscription");
const User = require("../models/user");
const cacheService = require("../services/cacheService");
const StripeService = require("../services/stripeService");
const cacheTypes = require("../utils/types/cacheType");
const createStripeCheckoutSession = async (req, res) => {
  const { user_id, price_id, type } = req.body;
  // let stripe_customer_id = "";
  try {
    if (!user_id) {
      throw new Error("Please provide user id");
    }
    const userExist = await User.findById(user_id);
    if (!userExist) {
      throw new Error("User not found");
    }

    console.log(
      "stripe: creating checkout session for user - ",
      userExist.email
    );
    const subscriptionExist = await Subscription.findOne({ userId: user_id });

    const checkoutRes = await StripeService.createStripeCheckout(
      userExist.email,
      price_id,
      type
    );

    if (!subscriptionExist) {
      const userSubscription = new Subscription({
        stripe_session_id: checkoutRes.id,
        userId: user_id,
        subscription_id: checkoutRes.payment_intent,
      });
      await userSubscription.save();
    }
    if (subscriptionExist) {
      if (subscriptionExist.isActive) {
        throw new Error(
          "Failed to create checkout session. Your subscription is active !!"
        );
      }
      subscriptionExist.stripe_session_id = checkoutRes.id;
      subscriptionExist.subscription_id = checkoutRes.payment_intent;
      await subscriptionExist.save();
    }

    return res.status(200).json({
      url: checkoutRes.url,
      success_url: checkoutRes.success_url,
      failure_url: checkoutRes.cancel_url,
    });
  } catch (error) {
    console.log(error);
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
          subscription_id: session.data.subscription,
          isActive: true,
        },
      }
    );

    await User.findByIdAndUpdate(subscriptionExist.userId, {
      subscriptionId: subscriptionExist._id,
    });

    return res.status(200).json({ message: "session confirmation success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    console.log("inside get subscriptions");
    const prices = await StripeService.getPrices();
    res.send(prices);
    await cacheService.set(cacheTypes.SUBSCRIPTION_DATA, prices);
  } catch (error) {
    console.log("*error: ", error);
    res.status(500).json({ message: error, success: false });
  }
};
const cancelSubscription = async (req, res) => {
  const { userId } = req.params;
  try {
    const userExist = await User.findById(userId);
    if (!userExist) {
      throw new Error("User not found");
    }
    const subscriptionExist = await Subscription.findOne({
      userId,
    });

    if (!subscriptionExist) {
      throw new Error("Subscription not found");
    }
    const subscriptonId = subscriptionExist.subscription_id;

    console.log("subscripton type", subscriptionExist.payment_type);

    if (subscriptionExist.payment_type === "online_payment") {
      if (!subscriptonId) {
        throw new Error("Subscription not found");
      }
      await StripeService.deleteSubscription(subscriptonId);
    }


    subscriptionExist.isActive = false;
    subscriptionExist.expiresAt = new Date();
    subscriptionExist.payment_type = undefined;
    subscriptionExist.subscription_id = undefined;
    subscriptionExist.stripe_session_id = undefined;
    await subscriptionExist.save();

    res.status(200).json({ message: "Subscription cancelled" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to cancel subscription" });
  }
};
const PaymentController = {
  getSubscriptions,
  createStripeCheckoutSession,
  confirmStripeCheckoutSession,
  cancelSubscription,
};
module.exports = PaymentController;
