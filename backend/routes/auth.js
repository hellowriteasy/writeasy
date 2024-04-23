const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

// Define routes for user authentication
router.post("/register", UserController.register);
router.post("/login", UserController.login);
// Add routes for logout, password management, etc. as needed...

module.exports = router;
