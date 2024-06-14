const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stripe_session_id: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
// Pre-save middleware to update expiresAt based on paidAt
subscriptionSchema.pre("save", function (next) {
  if (this.isModified("paidAt") || this.isNew) {
    if (this.paidAt) {
      const thirtyDaysLater = new Date(this.paidAt);
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      this.expiresAt = thirtyDaysLater;
    }
  }
  next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
