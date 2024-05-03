// src > services > authService.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { google } = require("google-auth-library");
const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.SERVER_URL}/google/callback`
);

class AuthService {
  async registerUser(username, email, password) {
    let user = await User.findOne({ email });
    if (user) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    return token;
  }

  async loginUser(email, password) {
    let user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email not found");
    }

    if (user.password && !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    return token;
  }

  async googleSignInOrRegister(token) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      // Create user without a password
      user = new User({
        username: payload.name || payload.email, // Fallback to email if name not available
        email: payload.email,
        googleId: payload.sub,
      });
      await user.save();
    }

    const userPayload = { user: { id: user.id } };
    const jwtToken = jwt.sign(userPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return jwtToken;
  }
}

module.exports = AuthService;
