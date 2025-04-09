const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../config/db");
const City = require("../models/City");

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe("Cities API", () => {
  describe("GET /cities", () => {
    it("should fetch all cities being monitored", async () => {
      const res = await request(app).get("/cities");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should return 404 if no cities are found", async () => {
      await City.destroy({ where: {} });

      const res = await request(app).get("/cities");

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("No cities found in the database.");
    });
  });

  describe("POST /cities", () => {
    it("should add a new city to the monitoring list", async () => {
      const cityName = "New York";

      const res = await request(app).post("/cities").send({ city: cityName });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe(
        `${cityName} has been added to the monitoring list.`
      );
    });

    it("should return 400 if city already exists in the monitoring list", async () => {
      const cityName = "New York";

      await request(app).post("/cities").send({ city: cityName });
      const res = await request(app).post("/cities").send({ city: cityName });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe(`${cityName} is already being monitored.`);
    });

    it("should return 400 if city name is missing", async () => {
      const res = await request(app).post("/cities").send({});

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("City name is required.");
    });
  });

  describe("DELETE /cities/:city", () => {
    it("should remove a city from the monitoring list", async () => {
      const cityName = "New York";

      const res = await request(app).delete(`/cities/${cityName}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        `${cityName} has been removed from the monitoring list.`
      );
    });

    it("should return 404 if city is not found in the monitoring list", async () => {
      const cityName = "NonExistentCity";

      const res = await request(app).delete(`/cities/${cityName}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe(
        `${cityName} is not found in the monitoring list.`
      );
    });
  });
});
