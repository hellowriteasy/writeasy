const Subscription = require("../../src/models/subscription");
const User = require("../../src/models/user");

async function assignSubscriptionIdToUser() {
  const subscription = await Subscription.find({});
  await Promise.all(
    subscription.map((subs) => {
      return User.findById(subs.userId).then(async (user) => {
        user.subscriptionId = subs._id;
        await user.save();
        console.log(user?.username, "updated");
      });
    })
  );
}
module.exports = assignSubscriptionIdToUser;
