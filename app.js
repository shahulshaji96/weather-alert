const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const cron = require("node-cron");
const { connectDB } = require("./config/db");
const weatherRoutes = require("./routes/weatherRoutes");
const alertRoutes = require("./routes/alertRoutes");
const cityRoutes = require("./routes/cityRoutes");
const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");
const { fetchWeatherForAllCities } = require("./services/weatherService");
dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

const corsOptions = {
  origin: "https://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "trusted-cdn.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
};

app.use(helmet(helmetOptions));

// Define routes
app.use("/weather", weatherRoutes);
app.use("/alerts", alertRoutes);
app.use("/cities", cityRoutes);

// Error handling middleware
app.use(errorHandler);

// Schedule weather fetch every 1 minutes
cron.schedule("*/1 * * * *", async () => {
  try {
    console.log("Fetching weather data...");
    const weatherData = await fetchWeatherForAllCities();
    if (weatherData) {
      logger.info("Fetched successfully:", weatherData);
    }
  } catch (error) {
    logger.error("Error during cron job:", error.message);
    console.error("Error during cron job:", error.stack);
  }
});

// Export the app for testing purposes
if (process.env.NODE_ENV !== "test") {
  // Don't start the server if running tests
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

module.exports = app;
