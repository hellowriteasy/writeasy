// routes > auth.js

const express = require("express");
const router = express.Router();
const UserController = require("../src/controllers/userController");
const {
  registerValidationRules,
  loginValidationRules,
  validate,
} = require("../middleware/validationMiddleware");
const { OAuth2Client } = require("google-auth-library"); // Corrected import
const AuthService = require("../src/services/AuthService");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.SERVER_URL}/api/auth/google/callback`
);

router.post(
  "/register",
  registerValidationRules(),
  validate,
  UserController.register
);
router.post("/login", loginValidationRules(), validate, UserController.login);

router.get("/google", (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
  res.redirect(url);
});

router.get("/google/callback", async (req, res) => {
  try {
    const { tokens } = await client.getToken(req.query.code);
    const token = await AuthService.prototype.googleSignInOrRegister(
      tokens.id_token
    );
    res.redirect(`/success?token=${token}`); // Redirect to the new success endpoint with token
  } catch (error) {
    console.error("Error during Google callback: ", error);
    res.status(500).send("An error occurred during Google authentication");
  }
});
module.exports = router;
