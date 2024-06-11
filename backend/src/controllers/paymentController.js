const StripeService = require("../services/stripeService");
const createStripeCheckoutSession = async (req, res) => {
  const { user_id } = req.body;
  try {
    const checkoutRes = await StripeService.createStripeCheckout(user_id);
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
    console.log("payment status", session.data.payment_status);
    if (session.data?.payment_status !== "paid") {
      throw new Error("Payment failed ");
    }
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
