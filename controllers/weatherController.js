const City = require('../models/City');
const WeatherService = require('../services/weatherService');
const logger = require('../utils/logger');

// Fetch weather data for all cities stored in the database
const fetchWeather = async (req, res) => {
  try {
    const citiesFromDb = await City.findAll();
    if (!citiesFromDb.length) {
      return res.status(404).json({ message: 'No cities found in the database.' });
    }

    logger.info(`Fetching weather data for ${citiesFromDb.length} cities.`);
    const weatherDataPromises = citiesFromDb.map(cityRecord =>
      WeatherService.fetchAndStoreWeather(cityRecord.name)
    );
    const weatherData = await Promise.all(weatherDataPromises);
    res.json(weatherData);
  } catch (error) {
    logger.error('Error fetching weather data: ', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { fetchWeather };
