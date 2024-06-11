const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  }, // Make password required only if googleId isn't set
  googleId: { type: String, unique: true, sparse: true }, // For users registering through Google
  lastLogin: { type: Date, default: Date.now },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

const User = mongoose.model("User", userSchema);
module.exports = User;