const Alert = require('../models/Alert');
const logger = require('../utils/logger');

// Fetch all alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll();
    if (alerts.length === 0) {
      return res.status(404).json({ message: 'No alerts found.' });
    }
    res.json(alerts);
  } catch (error) {
    logger.error('Error fetching alerts: ', error);
    res.status(500).json({ message: 'Server error while fetching alerts.' });
  }
};

module.exports = { getAlerts };
