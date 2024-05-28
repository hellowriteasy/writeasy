const User = require("../models/user");
const AuthService = require("../services/AuthService");
const authService = new AuthService();

const UserController = {
  async register(req, res) {
    const { username, email, password } = req.body;
    try {
      const { token, _id } = await authService.registerUser(username, email, password);
      
      // Fetch the new user information from the database
      const user = await User.findById(_id);

      res.json({
        token,
        _id,
        username: user.username,
        role: user.role,
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const { token, _id } = await authService.loginUser(email, password);
      
      // Fetch the user information from the database
      const user = await User.findById(_id);

      res.json({
        token,
        _id,
        username: user.username,
        role: user.role,
      });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = UserController;