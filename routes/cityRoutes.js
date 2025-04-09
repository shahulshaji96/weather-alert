const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

// GET /cities - Fetch all cities being monitored
router.get('/', cityController.getCities);

// POST /cities - Add a new city to monitor
router.post('/', cityController.addCity);

// DELETE /cities/:city - Remove a city from monitoring
router.delete('/:city', cityController.removeCity);

module.exports = router;
