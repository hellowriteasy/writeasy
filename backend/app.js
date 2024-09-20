const express = require("express");
const dotenv = require("dotenv");
const { connectDB, initializeDatabase } = require("./config/db");
const cors = require("cors");
const errorHandlingMiddleware = require("./middleware/errorHandlingMiddleware");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swaggerConfig");
const cron = require("node-cron");
const authRoutes = require("./routes/auth");
const storyRoutes = require("./routes/storyRoutes");
const promptRoutes = require("./routes/promptRoutes");
const contestRoutes = require("./routes/contestRoutes");
const emailRoutes = require("./routes/emailRoute");
const { createWriteStream } = require("fs");
const collaborativeStoryRoutes = require("./routes/collaborativeStoryRoutes");
const faqRoutes = require("./routes/faq");
const paymentRoutes = require("./routes/paymentRoute");
const categoriesRoute = require("./routes/category");
const scheduleJob = require("./config/cron");
const morgan = require("morgan");
const StripeService = require("./src/services/stripeService");
const pino = require("pino");
const logfilePath = "/var/log/writeasy-logs.log";
const logStream = createWriteStream(logfilePath, { flags: "a" });
const logger = pino({}, logStream);
dotenv.config();

connectDB();
initializeDatabase();

const app = express();
app.use(
  cors({
    origin: process.env.WHITELISTED_ORIGINS.split(","),
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
cron.schedule("*/10 * * * * *", () => scheduleJob());

app.get("/log", (req, res) => {
  logger.info("Received request");

  res.json({ message: "Server is up and running" });
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/category", categoriesRoute);
app.use("/api/collaborative-stories", collaborativeStoryRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/success", (req, res) => {
  const token = req.query.token;
  if (token) {
    res.status(200).send(`Authentication Success! Your token is: ${token}`);
  } else {
    res.status(200).send(`Authentication Success! No token received.`);
  }
});

// Global error handling
app.use(errorHandlingMiddleware);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}........`);
});