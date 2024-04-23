const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserController = {
  // @route   POST /register
  // @desc    Register a new user
  // @access  Public
  register: async (req, res) => {
    const { username, email, password } = req.body;

    try {
      // Check if user already exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      user = new User({
        username,
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 }, // 1 hour expiration
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },

  // @route   POST /login
  // @desc    Authenticate user & get token
  // @access  Public
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Create JWT token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 }, // 1 hour expiration
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
};

module.exports = UserController;
