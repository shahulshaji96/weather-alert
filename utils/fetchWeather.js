const axios = require('axios');
const logger = require('./logger');

const fetchWeatherData = async (city) => {
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch weather data for ${city}: ${error.message}`);
    throw new Error(`Failed to fetch weather data for ${city}`);
  }
};

module.exports = fetchWeatherData;
