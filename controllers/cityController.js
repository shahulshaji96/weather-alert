const City = require('../models/City');
const logger = require('../utils/logger');

// Fetch all cities being monitored
const getCities = async (req, res) => {
  try {
    const cities = await City.findAll();
    if (!cities.length) {
      return res.status(404).json({ message: 'No cities being monitored.' });
    }
    res.status(200).json({ message: 'Cities fetched successfully.', data: cities });
  } catch (error) {
    logger.error('s: ', error);
    res.status(500).json({ message: 'Error fetching cities.' });
  }
};

// Add a new city to monitor
const addCity = async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ message: 'City name is required.' });
  }

  try {
    const existingCity = await City.findOne({ where: { name: city } });
    if (existingCity) {
      return res.status(400).json({ message: `${city} is already being monitored.` });
    }

    await City.create({ name: city });
    logger.info(`City ${city} added to the monitoring list.`);
    res.status(201).json({ message: `${city} has been added to the monitoring list.` });
  } catch (error) {
    logger.error('Error adding city: ', error);
    res.status(500).json({ message: 'Error adding city.' });
  }
};

// Remove a city from monitoring
const removeCity = async (req, res) => {
  const { city } = req.params;

  try {
    const cityToRemove = await City.findOne({ where: { name: city } });
    if (!cityToRemove) {
      return res.status(404).json({ message: `${city} is not found in the monitoring list.` });
    }

    await City.destroy({ where: { name: city } });
    logger.info(`City ${city} removed from the monitoring list.`);
    res.status(200).json({ message: `${city} has been removed from the monitoring list.` });
  } catch (error) {
    logger.error('Error removing city: ', error);
    res.status(500).json({ message: 'Error removing city.' });
  }
};

module.exports = { getCities, addCity, removeCity };
