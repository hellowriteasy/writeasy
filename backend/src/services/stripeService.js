const stripe = require("../../config/stripe");

const createStripeCheckout = async () => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        policy_id: "writeasy",
        customer_id: "test_user",
      },
      line_items: [
        {
          price_data: {
            currency: "aud",
            product_data: {
              images: [
                "https://images.pexels.com/photos/19992420/pexels-photo-19992420/free-photo-of-hindu-goddess-decorated-with-flowers.jpeg?auto=compress&cs=tinysrgb&w=800",
              ],
              name: "Writeasy monthly subscription",
              description: `TYPE: Monthly Subscription  \nStart Date: 8th June 2024 \nEnd Date: 8th July 2024`,
            },
            unit_amount: Math.round(50 * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.FRONTEND_BASE_URL}/dashboard/agency/compare-policy/details/successfull/?session_id={CHECKOUT_SESSION_ID}&customer-id=1234&type=stripe`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/dashboard/agency/compare-policy/purchase/cancel/?session_id={CHECKOUT_SESSION_ID}&customer-id=123`,
    });

    return session;
  } catch (error) {
    console.log(error);
    throw new Error("stripe checkout error");
  }
};

 async function confirmStripeCheckout(session_id) {
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return {
      success: true,
      data: session,
    };
  } catch (e) {
    console.log(e);
    throw new Error("stripe session confirmation error");
  }
}

 const StripeService = {
    createStripeCheckout,
    confirmStripeCheckout
 };
module.exports= StripeService
