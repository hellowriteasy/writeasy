const express = require("express");
const router = express.Router();
const UserController = require("../src/controllers/userController");
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require("../middleware/validationMiddleware");

router.post(
  "/register",
  registerValidationRules(),
  validate,
  UserController.register
);
router.post("/login", loginValidationRules(), validate, UserController.login);

module.exports = router;
