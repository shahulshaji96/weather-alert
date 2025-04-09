const fetchWeatherData = require("../utils/fetchWeather");
const Weather = require("../models/Weather");
const AlertService = require("./alertService");
const { sequelize } = require("../config/db");
const logger = require("../utils/logger");

const fetchAndStoreWeather = async (city) => {
  const transaction = await sequelize.transaction();
  try {
    logger.info(`Fetching weather data for city: ${city}`);

    const data = await fetchWeatherData(city);

    if (
      !data ||
      !data.name ||
      !data.main ||
      !data.main.temp ||
      !data.weather ||
      !data.weather[0].main
    ) {
      throw new Error(`Invalid weather data for city: ${city}`);
    }

    await Weather.create(
      {
        city: data.name,
        temperature: data.main.temp,
        condition: data.weather[0].main,
      },
      { transaction }
    );

    await AlertService.checkForAlerts(data, transaction);
    await transaction.commit();

    logger.info(
      `Weather data successfully fetched and stored for city: ${city}`
    );
    return data;
  } catch (error) {
    await transaction.rollback();
    logger.error(
      `Error occurred while processing weather data for city: ${city}`,
      { error: error.message, stack: error.stack }
    );
    throw error;
  }
};

module.exports = { fetchAndStoreWeather };
