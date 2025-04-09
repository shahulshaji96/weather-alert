const City = require("../models/City");
const Weather = require("../models/Weather");
const fetchWeatherData = require("../utils/fetchWeather");
const AlertService = require("./alertService");
const { sequelize } = require("../config/db");
const logger = require("../utils/logger");

const fetchAndStoreWeather = async (city) => {
  const transaction = await sequelize.transaction();
  try {
    logger.info(`Fetching weather data for city: ${city}`);
    const data = await fetchWeatherData(city);

    if (!data?.name || !data?.main?.temp || !data?.weather?.[0]?.main) {
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

    logger.info(`Weather data stored for: ${city}`);
    return data;
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error processing city ${city}:`, {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

const fetchWeatherForAllCities = async () => {
  const cities = await City.findAll();
  if (!cities.length) throw new Error("No cities found in the database.");

  logger.info(`Fetching weather for ${cities.length} cities...`);

  const results = await Promise.allSettled(
    cities.map((city) => fetchAndStoreWeather(city.name))
  );

  const successful = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  const failed = results.filter((r) => r.status === "rejected");
  failed.forEach((f) => logger.warn(`Failed city fetch: ${f.reason.message}`));

  return successful;
};

module.exports = {
  fetchAndStoreWeather,
  fetchWeatherForAllCities,
};
