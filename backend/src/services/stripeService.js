const stripe = require("../../config/stripe");

const createStripeCheckout = async (email, priceId, type) => {
  const today = new Date();
  const startDate = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const endDateObj = new Date(today);
  endDateObj.setDate(endDateObj.getDate() + 30);
  const endDate = endDateObj.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  try {
    const session = await stripe.checkout.sessions.create({
      mode: type === "recurring" ? "subscription" : "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: 7,
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&type=stripe`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/failure?session_id={CHECKOUT_SESSION_ID}&type=string`,
      customer_email: email,
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
      name: `${username}`,
      email,
    });
    return customer;
  } catch (error) {
    console.log(error);
    new Error("stripe customer creation error", error);
  }
}
async function deleteCustomer(customer_id) {
  await stripe.customers.del(customer_id);
}
async function getPrices() {
  const prices = await stripe.prices.list({
    active: true,
  });
  return prices;
}
async function getStripeCustomers() {
  const customers = await stripe.customers.list();
  return customers;
}

const StripeService = {
  getPrices,
  createCustomer,
  deleteCustomer,
  getStripeCustomers,
  createStripeCheckout,
  confirmStripeCheckout,
};
module.exports = StripeService;
