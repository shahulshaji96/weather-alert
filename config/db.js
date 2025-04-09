const { Sequelize } = require("sequelize");
require("dotenv").config();
// Sequelize instance for PostgreSQL
const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: "postgres",
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
