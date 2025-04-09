const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/db");
const City = require("../models/City");
const Alert = require("../models/Alert");
const WeatherService = require("../services/weatherService");
const AlertService = require("../services/alertService");
const logger = require("../utils/logger");

jest.mock("../services/weatherService");
jest.mock("../services/alertService");
jest.mock("../utils/logger");

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

beforeEach(async () => {
  await Alert.destroy({ where: {} });
});

describe("Alerts API", () => {
  describe("POST /weather", () => {
    it("should trigger rain alert when rain is detected", async () => {
      const weatherData = {
        name: "New York",
        main: { temp: 25 },
        weather: [{ main: "Rain" }],
      };

      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce(weatherData);

      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      const alerts = await Alert.findAll();
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("Rain");
      expect(logger.info).toHaveBeenCalledWith(
        "Alert: Rain detected in New York"
      );
    });

    it("should trigger high temperature alert when above 30°C", async () => {
      const weatherData = {
        name: "New York",
        main: { temp: 35 },
        weather: [{ main: "Clear" }],
      };

      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce(weatherData);

      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      const alerts = await Alert.findAll();
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("High temperature (35°C)");
      expect(logger.info).toHaveBeenCalledWith(
        "Alert: High temperature (35°C) detected in New York"
      );
    });

    it("should trigger low temperature alert when below 10°C", async () => {
      const weatherData = {
        name: "New York",
        main: { temp: 5 },
        weather: [{ main: "Clear" }],
      };

      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce(weatherData);

      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      const alerts = await Alert.findAll();
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("Low temperature (5°C)");
      expect(logger.info).toHaveBeenCalledWith(
        "Alert: Low temperature (5°C) detected in New York"
      );
    });

    it("should handle temperatures below zero", async () => {
      const weatherData = {
        name: "New York",
        main: { temp: -0.55 },
        weather: [{ main: "Clear" }],
      };

      WeatherService.fetchAndStoreWeather.mockResolvedValueOnce(weatherData);

      const cityExists = await City.findOne({ where: { name: "New York" } });
      if (!cityExists) {
        await City.create({ name: "New York" });
      }

      const res = await request(app).get("/weather");

      expect(res.status).toBe(200);

      const alerts = await Alert.findAll();
      expect(alerts.length).toBe(1);
      expect(alerts[0].alertType).toBe("Low temperature (-0.55°C)");
      expect(logger.info).toHaveBeenCalledWith(
        "Alert: Low temperature (-0.55°C) detected in New York"
      );
    });
  });
});
