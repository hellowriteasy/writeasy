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

}

module.exports = AuthService;
