const { fetchWeatherForAllCities } = require("../services/weatherService");
const logger = require("../utils/logger");

const fetchWeather = async (req, res) => {
  try {
    const weatherData = await fetchWeatherForAllCities();
    res.status(200).json(weatherData);
  } catch (error) {
    logger.error("Error fetching weather (controller):", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { fetchWeather };
