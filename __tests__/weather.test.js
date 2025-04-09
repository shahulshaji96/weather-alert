const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/db");
const City = require("../models/City");
const Alert = require("../models/Alert");
const WeatherService = require("../services/weatherService");

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

      const cityExists = await City.findOne({ where: { name: cityName } });
      if (!cityExists) {
        await City.create({ name: cityName });
      }

      const res = await request(app).get("/weather");
      expect(res.status).toBe(200);
    });

    it("should return 404 if no cities are found", async () => {
      await City.destroy({ where: {} });

      const res = await request(app).get("/weather");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("No cities found in the database.");
    });

    it("should trigger rain alert when rain is detected", async () => {
      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce({
        name: "New York",
        main: { temp: 25 },
        weather: [{ main: "Rain" }],
      });

      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      const res = await request(app).get("/weather");
      expect(res.status).toBe(200);

      const alerts = await Alert.findAll();
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("Rain");
    });

    it("should trigger high temperature alert when temperature exceeds threshold", async () => {
      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce({
        name: "New York",
        main: { temp: 35 },
        weather: [{ main: "Clear" }],
      });

      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      const res = await request(app).get("/weather");
      expect(res.status).toBe(200);

      const alerts = await Alert.findAll();
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("High temperature (35°C)");
    });

    it("should trigger low temperature alert when temperature falls below threshold", async () => {
      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce({
        name: "New York",
        main: { temp: 5 },
        weather: [{ main: "Clear" }],
      });

      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      const res = await request(app).get("/weather");
      expect(res.status).toBe(200);

      const alerts = await Alert.findAll();
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("Low temperature (5°C)");
    });
  });
});
