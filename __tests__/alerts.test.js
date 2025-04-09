const request = require("supertest");
const app = require("../app"); // Assuming your Express app is in 'app.js'
const { sequelize } = require("../config/db"); // Assuming Sequelize config is here
const City = require("../models/City"); // Assuming you have a City model
const Alert = require("../models/Alert"); // Assuming you have an Alert model
const WeatherService = require("../services/weatherService"); // Import WeatherService
const AlertService = require("../services/alertService"); // Assuming you have an AlertService
const logger = require("../utils/logger"); // Assuming you have a logger

// Mocking the external weather API service
jest.mock("../services/weatherService");
jest.mock("../services/alertService");
jest.mock("../utils/logger"); // Mocking logger to test logs

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  // Clear all alerts before each test
  await Alert.destroy({ where: {} }); // This deletes all the alerts
});

describe("Alerts API", () => {
  describe("POST /weather", () => {
    it("should trigger rain alert when rain is detected in the weather data", async () => {
      // Custom weather data with rain
      const weatherData = {
        name: "New York",
        main: { temp: 25 },
        weather: [{ main: "Rain" }],
      };

      // Mock the response from the weather service
      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce(weatherData);

      // Ensure the city is added to the monitoring list if it doesn't already exist
      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      // Call the API endpoint
      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      // Check if the alert has been triggered
      const alerts = await Alert.findAll();
      console.log("Alert count:", alerts.length); // For debugging
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("Rain");

      // Check if the logger has logged the rain alert
      expect(logger.info).toHaveBeenCalledWith(
        "Alert: Rain detected in New York"
      );
    });

    it("should trigger high temperature alert when temperature exceeds threshold", async () => {
      // Custom weather data with high temperature
      const weatherData = {
        name: "New York",
        main: { temp: 35 }, // Temperature 35°C, which is high
        weather: [{ main: "Clear" }],
      };

      // Mock the response from the weather service
      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce(weatherData);

      // Ensure the city is added to the monitoring list if it doesn't already exist
      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      // Call the API endpoint
      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      // Check if the alert has been triggered
      const alerts = await Alert.findAll();
      console.log("Alert count:", alerts.length); // For debugging
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("High temperature (35°C)");

      // Check if the logger has logged the high temperature alert
      expect(logger.info).toHaveBeenCalledWith(
        "Alert: High temperature (35°C) detected in New York"
      );
    });

    it("should trigger low temperature alert when temperature falls below threshold", async () => {
      // Custom weather data with low temperature
      const weatherData = {
        name: "New York",
        main: { temp: 5 }, // Temperature 5°C, which is low
        weather: [{ main: "Clear" }],
      };

      // Mock the response from the weather service
      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce(weatherData);

      // Ensure the city is added to the monitoring list if it doesn't already exist
      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      // Call the API endpoint
      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      // Check if the alert has been triggered
      const alerts = await Alert.findAll();
      console.log("Alert count:", alerts.length); // For debugging
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("Low temperature (5°C)");

      // Check if the logger has logged the low temperature alert
      expect(logger.info).toHaveBeenCalledWith(
        "Alert: Low temperature (5°C) detected in New York"
      );
    });

    it("should trigger low temperature alert even if the temperature is below zero", async () => {
      // Custom weather data with very low temperature
      const weatherData = {
        name: "New York",
        main: { temp: -0.55 }, // Temperature -0.55°C, below zero
        weather: [{ main: "Clear" }],
      };

      // Mock the response from the weather service
      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce(weatherData);

      // Ensure the city is added to the monitoring list if it doesn't already exist
      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      // Call the API endpoint
      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      // Check if the alert has been triggered
      const alerts = await Alert.findAll();
      console.log("Alert count:", alerts.length); // For debugging
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("Low temperature (-0.55°C)");

      // Check if the logger has logged the low temperature alert
      expect(logger.info).toHaveBeenCalledWith(
        "Alert: Low temperature (-0.55°C) detected in New York"
      );
    });
  });
});
