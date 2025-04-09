const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Import sequelize instance from config

const City = sequelize.define(
  "City",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure each city is unique
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Automatically set the timestamp when a city is added
    },
  },
  {
    timestamps: false, // Disable Sequelize's automatic timestamps (we're using createdAt explicitly)
  }
);

module.exports = City;
