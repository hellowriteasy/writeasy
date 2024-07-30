const stripe = require("../../config/stripe");

const createStripeCheckout = async (email) => {
  const today = new Date();
  const startDate = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const endDateObj = new Date(today);
  endDateObj.setDate(endDateObj.getDate() + 30);
  const endDate = endDateObj.toISOString().split("T")[0]; // Format: YYYY-MM-DD
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
            currency: "gbp",
            product_data: {
              images: [
                "https://firebasestorage.googleapis.com/v0/b/debai-d0809.appspot.com/o/images%2Flogo.png?alt=media&token=0b709800-aa9c-4557-88e2-6f462f6aa9b3",
              ],
              name: "Writeasy monthly subscription",
              description: `TYPE: Monthly Subscription  \nStart Date: ${startDate} \nEnd Date: ${endDate}`,
            },
            unit_amount: Math.round(20 * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${process.env.FRONTEND_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&type=stripe`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/failure?session_id={CHECKOUT_SESSION_ID}&type=string`,
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

async function createCustomer({ username, email }) {
  try {
    const customer = await stripe.customers.create({
      name: `${customer}`,
      email,
    });
    return customer.id;
  } catch (error) {
    console.log(error);
    new Error("stripe customer creation error", error);
  }
}

const StripeService = {
  createCustomer,
  createStripeCheckout,
  confirmStripeCheckout,
};
module.exports = StripeService;
