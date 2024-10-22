const Subscription = require("../models/subscription");
const User = require("../models/user");
const AuthService = require("../services/AuthService");
const StripeService = require("../services/stripeService");
const authService = new AuthService();
const EmailServiceClass = require("../services/emailService");
const { calculateSubscriptionRemainingDays } = require("../utils/methods");
const {
  getDeviceInfo,
  checkIpAddressValidationChangedLimits,
} = require("../../utils/methods");
const EmailService = new EmailServiceClass();
const loginHistorySchema = require("../models/session");
const siteConfigModel = require("../models/app");
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
      const { token, _id, status } = await authService.loginUser(
        email,
        userPassword
      );

      const deviceInfo = await getDeviceInfo(req, _id);

      // Fetch the user information from the database
      const user = await User.findById(_id);

      const subscription = await Subscription.findOne({
        userId: _id,
      });

      const { password, ...others } = user._doc;
      const subscriptionId = subscription?.subscription_id;

      let stripeSubscription = null;
      if (subscription?.isActive && subscriptionId) {
        stripeSubscription = await StripeService.getSubscription(
          subscriptionId
        );
      }
      const subscriptionRemainingDays = calculateSubscriptionRemainingDays(
        subscription?.expiresAt
      );

      user.lastLogin = new Date();
      await user.save();
      await loginHistorySchema.create({
        userId: _id,
        browser: {
          name: deviceInfo.name,
          version: deviceInfo.version,
        },
        os: {
          name: deviceInfo.os.name,
          version: deviceInfo.os.version,
        },
        deviceLanguage: deviceInfo.deviceLanguage,
        ip: deviceInfo.ip,
        location: {
          city: deviceInfo.location.city,
          region: deviceInfo.location.region,
          country: deviceInfo.location.country,
          lat: deviceInfo.location.lat,
          lon: deviceInfo.location.lon,
        },
        timezone: deviceInfo.location.timezone,
        org: deviceInfo.org,
      });

      checkIpAddressValidationChangedLimits(user._id, 3);

      await res.json({
        ...others,
        token,
        isSubcriptionActive: !!subscription?.isActive,
        subscriptionType: subscription?.payment_type,
        subscriptionRemainingDays,
        subscriptionStatus: stripeSubscription?.status || "",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: error.message });
    }
  },
  async deleteUserById(req, res) {
    const { id: user_id } = req.params;
    try {
      if (!user_id) {
        throw new Error("Please provide user id");
      }
      await User.findByIdAndDelete(user_id);
      await Subscription.deleteOne({
        userId: user_id,
      });
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.message || "Internal server error",
        success: false,
      });
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

      const subscriptionId = subscription?.subscription_id;
      let stripeSubscription = null;

      if (subscription?.isActive && subscriptionId) {
        stripeSubscription = await StripeService.getSubscription(
          subscriptionId
        );
      }

      const subscriptionRemainingDays = calculateSubscriptionRemainingDays(
        subscription?.expiresAt
      );

      return res.status(200).json({
        message: {
          ...others,
          isSubcriptionActive,
          subscriptionRemainingDays,
          subscriptionType: subscription?.payment_type,
          subscription_id: subscription?.subscription_id,
          subscriptionStatus: stripeSubscription?.status || "",
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
        userExist.subscriptionId = subscription._id;
        await userExist.save();
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
        userExist.subscriptionId = newSubscription._id;
        await userExist.save();
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

      users = users.filter((user) => user?.userId);

      users = users.map((user) => {
        if (!user?.userId) {
          console.log(user);
        }
        return {
          ...user.userId?._doc,
          isSubcriptionActive: !!user.isActive,
          expiresAt: user.expiresAt,
          payment_type: user.payment_type,
        };
      });
      res.status(200).json({ data: users, success: true });
    } catch (error) {
      console.log(error);
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
  async sentLinkToResetPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw {
          type: "custom",
          message: "This email is not registered in Writeasy",
        };
      }
      const emailHash = await authService.generateToken(email);

      const messageId = await EmailService.sendEmail({
        subject: "Reset writeasy password ",
        email,
        message: `<div >
         <h1 style="color:#0e0b3d;text-align:center;" > Reset your password  </h1> </br>
          </br> <h4 style="color:#0e0b3d;text-align:center;">Click the button below to reset  your password. </h4> <br/> <a style="background:#FCD800; display:block; width:fit-content; margin:auto;  text-decoration:none;  padding:8px ; cursor:pointer;letter-spacing:1px; border-radius:4px;text-align:center;color:black;" href="${process.env.FRONTEND_BASE_URL}/change-password?token=${emailHash}"> RESET PASSWORD </a> </br> <br> <br>  </div>`,
      });

      return res
        .status(200)
        .json({ message: "reset link sent", success: true });
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (error.type === "custom") {
        errorMessage = error.message;
      }

      return res.status(500).json({ message: errorMessage, success: true });
    }
  },
  async handleResetPassword(req, res) {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const { email, exp, invalidLink } = await authService.validateToken(
        token
      );
      if (email) {
        const user = await User.findOne({ email });
        if (!user) {
          throw { type: "custom", message: "Authorization failed" };
        }
        const newPassword = await authService.generateHash(password);
        user.password = newPassword;
        await user.save();
        return res
          .status(200)
          .json({ message: "password reset successfully", success: true });
      } else if (invalidLink) {
        throw {
          type: "custom",
          message: "Invalid link",
        };
      } else {
        throw {
          type: "custom",
          message: "Link expired",
        };
      }
    } catch (error) {
      console.log(error);
      let errorMessage = "something went wrong";
      let expired = false;
      let invalidLink = false;

      if (error.type === "custom") {
        errorMessage = error.message;
        if (error.message === "Link expired") {
          expired = true;
          errorMessage = "Password reset link has been expired";
        } else {
          errorMessage = "Invalid password reset link";

          invalidLink = true;
        }
      }
      return res.status(500).json({ message: errorMessage, success: false });
    }
  },
  async updateUserPractiseLimit(req, res) {
    const { limit } = req.body;

    try {
      // Fetch the site configuration
      const config = await siteConfigModel.find();

      // Check if site configuration exists
      if (!config || config.length === 0) {
        // If no config exists, create a new one with the provided limit
        await siteConfigModel.create({
          sitePractiseLimit: +limit,
        });
      } else {
        // If config exists, store the previous practice limit

        // Update the site practice limit with the new limit
        await siteConfigModel.findByIdAndUpdate(config[0]._id, {
          $set: { sitePractiseLimit: +limit },
        });
      }

      await User.updateMany({}, { practiceLimit: +limit });

      res
        .status(200)
        .json({ message: "Successfully updated users' practice limits" });
    } catch (error) {
      // Handle errors
      res
        .status(500)
        .json({ message: error?.message || "Failed to update practice limit" });
    }
  },
  async getUserPractiseLimit(req, res) {
    const { userId } = req.query;
    try {
      const config = await siteConfigModel.find();
      const limit = config[0]?.sitePractiseLimit || 5;
      let remainingLimit = null;
      if (userId) {
        const userExist = await User.findById(userId);
        remainingLimit = userExist.practiceLimit;
      }
      res.status(200).json({
        limit: limit || 5,
        remainingLimit: remainingLimit,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: error?.message || "Failed to get practice limit" });
    }
  },
};

module.exports = UserController;
