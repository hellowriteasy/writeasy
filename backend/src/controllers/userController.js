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
  async searchUser(req, res) {
    const { search_query, exclude_unpaid_user } = req.query;
    try {
      let keyword = {};
      keyword = search_query
        ? {
            $or: [
              {
                username: { $regex: search_query, $options: "i" },
              },
              { email: { $regex: search_query, $options: "i" } },
            ],
          }
        : {};
      const users = await User.find(keyword).select("-password");
      let data = await Promise.all(
        users.map(async (user) => {
          const subscription = await Subscription.findOne({
            userId: user._id,
          });
          console.log("subscription", subscription);
          return {
            ...user._doc,
            isSubcriptionActive: !!subscription?.isActive,
            expiresAt: subscription?.expiresAt || null,
          };
        })
      );

      if (exclude_unpaid_user === "true") {
        data = data.filter((user) => user.isSubcriptionActive);
      }

      res.status(200).json(data);
    } catch (error) {
      res
        .status(500)
        .json({ message: error?.message || "Internal server error" });
    }
  },
  async updateSubscription(req, res) {
    //
    const { user_id, end_date } = req.body;
    try {
      if (!user_id || !end_date) {
        throw new Error("Please provide all the fields");
      }
      const userExist = await User.findById(user_id);
      if (!userExist) {
        throw new Error("User not found ");
      }

      const subscription = await Subscription.findOne({
        userId: user_id,
      });
      // if (subscription && subscription.isActive) {
      //   throw new Error("User already has an active subscription");
      // }
      if (subscription) {
        subscription.expiresAt = new Date(end_date);
        subscription.isActive = true;
        subscription.payment_type = "cash_payment";
        await subscription.save();
      }
      if (!subscription) {
        const newSubscription = new Subscription({
          userId: user_id,
          paidAt: Date.now(),
          expiresAt: end_date,
          isActive: true,
          stripe_session_id: "test",
          payment_type: "cash_payment",
        });
        await newSubscription.save();
      }
      res.status(201).json({
        message: "Subscription updated successfully",
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Internal server error" });
    }
  },
  async getCashPaymentUsers(req, res) {
    try {
      let users = await Subscription.find({
        payment_type: "cash_payment",
      })
        .populate({
          path: "userId",
          model: "User",
          select: "-password",
        })
        .sort({
          updatedAt: "desc",
        });

      users = users.map((user) => {
        return {
          ...user.userId._doc,
          isSubcriptionActive: !!user.isActive,
          expiresAt: user.expiresAt,
          payment_type: user.payment_type,
        };
      });
      res.status(200).json({ data: users, success: true });
    } catch (error) {
      res
        .status(500)
        .json({ message: error?.message || "Internal server error" });
    }
  },
  async unsubscribeEmail(req, res) {
    const { email } = req.body;
    try {
      const userExist = await User.findOne({ email });
      if (!userExist) {
        throw new Error("User not found with this email");
      }
      if (userExist.email_unsubscribed) {
        throw new Error("This email is already unsubscribed");
      }
      userExist.email_unsubscribed = true;
      await userExist.save();
      res
        .status(200)
        .json({ message: "Email unsubscribed successfully", success: true });
    } catch (error) {
      res
        .status(500)
        .json({ message: error?.message || "Internal server error" });
    }
  },
  async subscribeEmail(req, res) {
    const { email } = req.body;
    try {
      const userExist = await User.findOne({ email });
      if (!userExist) {
        throw new Error("User not found with this email");
      }
      if (!userExist.email_unsubscribed) {
        throw new Error("You are  already subscribed");
      }
      userExist.email_unsubscribed = false;
      await userExist.save();
      res
        .status(200)
        .json({ message: "Email subscribed successfully", success: true });
    } catch (error) {
      res
        .status(500)
        .json({ message: error?.message || "Internal server error" });
    }
  },
};

module.exports = UserController;
