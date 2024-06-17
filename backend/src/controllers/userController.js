const Subscription = require("../models/subscription");
const User = require("../models/user");
const AuthService = require("../services/AuthService");
const { calculateSubscriptionRemainingDays } = require("../utils/methods");
const authService = new AuthService();

const UserController = {
  async register(req, res) {
    const { username, email, password } = req.body;
    try {
      const { token, _id } = await authService.registerUser(
        username,
        email,
        password
      );

      // Fetch the new user information from the database
      const user = await User.findById(_id);

      res.json({
        token,
        _id,
        username: user.username,
        role: user.role,
        subscriptionType: user.subscriptionType,
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  async login(req, res) {
    const { email, password: userPassword } = req.body;
    try {
      const { token, _id } = await authService.loginUser(email, userPassword);

      // Fetch the user information from the database
      const user = await User.findById(_id);

      const subscription = await Subscription.findOne({
        userId: _id,
      });

      const { password, ...others } = user._doc;
      const isSubcriptionActive = !!subscription?.isActive;
      let subscriptionRemainingDays = null;
      if (isSubcriptionActive) {
        subscriptionRemainingDays = calculateSubscriptionRemainingDays(
          subscription.paidAt,
          subscription.expiresAt
        );
      }

      res.json({
        ...others,
        token,
        isSubcriptionActive,
        subscriptionRemainingDays,
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
  async getUserById(req, res) {
    const { id: user_id } = req.params;
    try {
      if (!user_id) {
        throw new Error("Please provide user id");
      }
      const user = await User.findById(user_id);
      const subscription = await Subscription.findOne({
        userId: user_id,
      });
      const { password, ...others } = user._doc;
      const isSubcriptionActive = !!subscription?.isActive;
      let subscriptionRemainingDays = null;
      if (isSubcriptionActive) {
        subscriptionRemainingDays = calculateSubscriptionRemainingDays(
          subscription.paidAt,
          subscription.expiresAt
        );
      }

      return res.status(200).json({
        message: {
          ...others,
          isSubcriptionActive,
          subscriptionRemainingDays,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Internal server error",
        success: false,
      });
    }
  },
  async updateProfile(req, res) {
    const { user_id } = req.params;

    try {
      const userExist = await User.findById(user_id);
      if (!userExist) {
        throw new Error("User not found ");
      }

      await User.findByIdAndUpdate(user_id, {
        $set: {
          ...req.body,
        },
      });
      res
        .status(201)
        .json({ message: "Profile updated successfully", success: true });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Internal server error",
        success: false,
      });
    }
  },
};

module.exports = UserController;
