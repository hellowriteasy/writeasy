const AuthService = require("../services/AuthService");
const authService = new AuthService();

const UserController = {
  async register(req, res) {
    const { username, email, password } = req.body;
    try {
      const token = await authService.registerUser(username, email, password);
      res.json({ token });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const token = await authService.loginUser(email, password);
      res.json({ token });
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  },
};

module.exports = UserController;
