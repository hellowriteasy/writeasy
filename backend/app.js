const express = require("express");
const dotenv = require("dotenv");
const { connectDB, initializeDatabase } = require("./config/db");

const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const storyRoutes = require("./routes/storyRoutes");
const promptRoutes = require("./routes/promptRoutes");
const contestRoutes = require("./routes/contestRoutes");

dotenv.config();

connectDB();
initializeDatabase();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/contests", contestRoutes);

// Global error handling
app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
