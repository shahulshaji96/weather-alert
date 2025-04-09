const request = require("supertest");
const app = require("../app"); // Assuming your Express app is in 'app.js'
const { sequelize } = require("../config/db"); // Assuming Sequelize config is here
const City = require("../models/City"); // Assuming you have a City model
const Alert = require("../models/Alert");
const WeatherService = require("../services/weatherService");
const logger = require("../utils/logger");

// Mocking the external weather API service
jest.mock("../services/weatherService");

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe("Weather API", () => {
  describe("GET /weather", () => {
    it("should fetch weather data for all cities being monitored", async () => {
      const cityName = "New York";

      // Check if the city exists before adding it
      const cityExists = await City.findOne({ where: { name: cityName } });
      if (!cityExists) {
        await City.create({ name: cityName });
      }

      const res = await request(app).get("/weather");
      expect(res.status).toBe(200);
      // Continue with other assertions
    });
    it("should return 404 if no cities are found", async () => {
      await City.destroy({ where: {} }); // Clear the city table

      const res = await request(app).get("/weather");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("No cities found in the database.");
    });
    it("should trigger rain alert when rain is detected in the weather data", async () => {
      // Mock the weather data response with rain
      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce({
        name: "New York",
        main: { temp: 25 },
        weather: [{ main: "Rain" }],
      });

      // Check if the city already exists before creating
      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      const alerts = await Alert.findAll();
      console.log("Alert count:", alerts.length); // For debugging
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("Rain");
    });

    it("should trigger high temperature alert when temperature exceeds threshold", async () => {
      // Mock the weather data with high temperature
      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce({
        name: "New York",
        main: { temp: 35 },
        weather: [{ main: "Clear" }],
      });

      // Check if the city already exists before creating
      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      const alerts = await Alert.findAll();
      console.log("Alert count:", alerts.length); // For debugging
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("High temperature (35°C)");
    });

    it("should trigger low temperature alert when temperature falls below threshold", async () => {
      // Mock the weather data with low temperature
      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce({
        name: "New York",
        main: { temp: 5 },
        weather: [{ main: "Clear" }],
      });

      // Check if the city already exists before creating
      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      const alerts = await Alert.findAll();
      console.log("Alert count:", alerts.length); // For debugging
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("Low temperature (5°C)");
    });
  });
});
