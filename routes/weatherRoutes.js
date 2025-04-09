const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

// GET /weather - Fetch latest weather data
router.get("/", weatherController.fetchWeather);

module.exports = router;
