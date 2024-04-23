const express = require("express");
const dotenv = require("dotenv");
const { connectDB, initializeDatabase } = require("./config/db");
const authRoutes = require("./routes/auth");

// Load environment variables
dotenv.config();

connectDB();
initializeDatabase();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Use authentication routes
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
