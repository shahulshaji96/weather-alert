const express = require("express");
const dotenv = require("dotenv");
const cron = require("node-cron");
const { connectDB } = require("./config/db");
const weatherRoutes = require("./routes/weatherRoutes");
const alertRoutes = require("./routes/alertRoutes");
const cityRoutes = require("./routes/cityRoutes");
const errorHandler = require("./utils/errorHandler");
const fetchWeatherData = require("./utils/fetchWeather"); // Ensure this is imported

dotenv.config();
connectDB();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Define your routes
app.use("/weather", weatherRoutes);
app.use("/alerts", alertRoutes);
app.use("/cities", cityRoutes);

// Error handling middleware
app.use(errorHandler);

// Schedule weather fetch every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  console.log("Fetching weather data...");
  await fetchWeatherData("London"); // Call weather fetching for cities, replace 'London' with dynamic city fetching logic
});

// Export the app for testing purposes
if (process.env.NODE_ENV !== "test") {
  // Don't start the server if running tests
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

module.exports = app; // Export the app for testing
