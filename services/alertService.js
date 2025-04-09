const Alert = require("../models/Alert");
const logger = require("../utils/logger");

// Check for weather alerts based on the fetched data
const checkForAlerts = async (data, transaction) => {
  const { name: city, main, weather } = data;
  const temperature = main.temp;
  const condition = weather[0].main.toLowerCase();

  const alerts = [];

  // Check for rain condition
  if (condition.includes("rain")) {
    const existingRainAlert = await Alert.findOne({
      where: { city, alertType: "Rain" },
      transaction,
    });

    if (!existingRainAlert) {
      // Create a new Rain alert if not already exists
      alerts.push(Alert.create({ city, alertType: "Rain" }, { transaction }));
      logger.info(`Alert: Rain detected in ${city}`);
    } else {
      // Optionally, update the existing Rain alert (e.g., update timestamp or status)
      logger.info(`Alert already exists: Rain in ${city}`);
    }
  }

  // Check for high temperature condition (above 30°C)
  if (temperature > 30) {
    const existingHighTempAlert = await Alert.findOne({
      where: { city, alertType: `High temperature (${temperature}°C)` },
      transaction,
    });

    if (!existingHighTempAlert) {
      // Create a new High Temp alert if not already exists
      alerts.push(
        Alert.create(
          { city, alertType: `High temperature (${temperature}°C)` },
          { transaction }
        )
      );
      logger.info(
        `Alert: High temperature (${temperature}°C) detected in ${city}`
      );
    } else {
      // Optionally, update the existing High Temp alert (e.g., update timestamp or status)
      logger.info(
        `Alert already exists: High temperature (${temperature}°C) in ${city}`
      );
    }
  }

  // Check for low temperature condition (below 10°C)
  if (temperature < 10) {
    const existingLowTempAlert = await Alert.findOne({
      where: { city, alertType: `Low temperature (${temperature}°C)` },
      transaction,
    });

    if (!existingLowTempAlert) {
      // Create a new Low Temp alert if not already exists
      alerts.push(
        Alert.create(
          { city, alertType: `Low temperature (${temperature}°C)` },
          { transaction }
        )
      );
      logger.info(
        `Alert: Low temperature (${temperature}°C) detected in ${city}`
      );
    } else {
      // Optionally, update the existing Low Temp alert (e.g., update timestamp or status)
      logger.info(
        `Alert already exists: Low temperature (${temperature}°C) in ${city}`
      );
    }
  }

  // Execute all alert-related database operations
  await Promise.all(alerts);
};

module.exports = { checkForAlerts };
