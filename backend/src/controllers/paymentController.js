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
    // stripe_customer_id = subscriptionExist?.stripe_customer_id;

    // if (!stripe_customer_id) {
    // console.log("stripe creating customer", userExist.username);
    // const customer = await StripeService.createCustomer({
    //   email: userExist.email,
    //   username: userExist.username,
    // });
    // stripe_customer_id = customer.id;
    // }

    const checkoutRes = await StripeService.createStripeCheckout(
      userExist.email,
      price_id,
      type
    );

    if (!subscriptionExist) {
      const userSubscription = new Subscription({
        stripe_session_id: checkoutRes.id,
        userId: user_id,
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
    console.log(
      "stripe: creating confirming checkout session. stripe session id- ",
      stripe_session_id
    );
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
    const prices = await StripeService.getPrices();
    res.send(prices);
    await cacheService.set(cacheTypes.SUBSCRIPTION_DATA, prices);
  } catch (error) {
    console.log("*error: ", error);
    res.status(500).json({ message: error, success: false });
  }
};
const PaymentController = {
  getSubscriptions,
  createStripeCheckoutSession,
  confirmStripeCheckoutSession,
};
module.exports = PaymentController;
