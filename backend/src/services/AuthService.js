// src > services > authService.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
      throw new Error("Email address already exists.");
    }

    const hashedPassword = await this.generateHash(password);

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
    return { token, _id: user.id }; // Return token and _id
  }

  async loginUser(email, password) {
    let user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email address not found.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    return { token, _id: user.id }; // Return token and _id
  }

  async generateHash(string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(string, salt);
    return hashedPassword;
  }
  async googleSignInOrRegister(token) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        email: payload.email,
        googleId: payload.sub,
      });
      await user.save();
    }
    const userPayload = { user: { id: user.id } };
    const jwtToken = jwt.sign(userPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { token: jwtToken, _id: user.id }; // Return token and _id
  }
  async generateToken(email) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: 60 * 10,
    });
    return token;
  }
  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { email: decoded?.email, exp: false, invalidLink: false };
    } catch (error) {
      console.log(error.message);
      if (error?.message === "jwt expired") {
        return { email: null, exp: true, invalidLink: false };
      } else {
        return { email: null, exp: false, invalidLink: true };
      }
    }
  }
}

module.exports = AuthService;
