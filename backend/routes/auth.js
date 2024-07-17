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

/**
 * @openapi
 * /api/auth/user/{id}:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get user details
 *     description: Retrieve user data by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Sends user data
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get("/user/:id", UserController.getUserById);

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Registers a new user and returns user data with token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Successfully registered the user.
 *       400:
 *         description: Validation errors or incorrect data.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/register",
  registerValidationRules(),
  validate,
  UserController.register
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticate and log in the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully logged in the user.
 *       401:
 *         description: Unauthorized access. Invalid credentials or user account is inactive.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", loginValidationRules(), validate, UserController.login);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User logout
 *     description: Log out the user. But the localstorage should be emptied from the frontend! Mind this!!
 *     responses:
 *       200:
 *         description: Successfully logged out the user.
 */
router.post("/logout", (req, res) => {
  // (IMPORTANT) Instruct frontend client to remove the token from local storage
  res.status(200).send({ message: "Logged out successfully" });
});

/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Google login
 *     description: Initiate the Google login flow.
 *     responses:
 *       302:
 *         description: Redirect to the Google OAuth authorization page.
 */
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

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Google login callback
 *     description: Callback for handling the Google OAuth response.
 *     parameters:
 *       - name: code
 *         in: query
 *         description: Authorization code received from Google OAuth.
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to the success page with the authentication token.
 *       500:
 *         description: Internal server error.
 */
router.get("/google/callback", async (req, res) => {
  try {
    const { tokens } = await client.getToken(req.query.code);
    const token = await AuthService.prototype.googleSignInOrRegister(
      tokens.id_token
    );
    res.redirect(
      `${process.env.FRONTEND_BASE_URL}/auth/google/success?token=${token.token}&user_id=${token._id}`
    ); // Redirect to the new success endpoint with token
  } catch (error) {
    console.error("Error during Google callback: ", error);
    res.status(500).send("An error occurred during Google authentication");
  }
});

/**
 * @swagger
 * /api/auth/users/profile/{user_id}:
 *   put:
 *     summary: Update a user's profile
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username of the user
 *               email:
 *                 type: string
 *                 description: The new email of the user
 *               password:
 *                 type: string
 *                 description: The new password of the user
 *               profile_picture:
 *                 type: string
 *                 description: The new profile picture URL of the user
 *     responses:
 *       201:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 success:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 success:
 *                   type: boolean
 *                   example: false
 */
router.put("/users/profile/:user_id", UserController.updateProfile);

/**
 * @swagger
 * /api/auth/users/search:
 *   get:
 *     summary: Search for users by username or email
 *     tags: [Authentication]
 *     parameters:
 *       - in: query
 *         name: search_query
 *         schema:
 *           type: string
 *         description: Search term for username or email
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     example: johndoe@example.com
 *       500:
 *         description: Internal server error
 */

router.get("/users/search", UserController.searchUser);

/**
 * @openapi
 * /api/auth/users/subscribe:
 *   put:
 *     tags:
 *       - Authentication
 *     summary: Update a user's subscription
 *     description: Updates a user's subscription, activating it if it's inactive or creating a new one if it doesn't exist.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The ID of the user.
 *                 example: "60b725f10c9f1c71b64b8b98"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 description: The end date of the subscription.
 *                 example: "2024-12-31"
 *     responses:
 *       201:
 *         description: Subscription updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription updated successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad request. User ID or end date is missing or invalid.
 *       404:
 *         description: User not found.
 *       409:
 *         description: User already has an active subscription.
 *       500:
 *         description: Internal server error.
 */

router.put("/users/subscribe", UserController.updateSubscription);

router.get("/users/cash-payers", UserController.getCashPaymentUsers);
module.exports = router;
