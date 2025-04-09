const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Weather = sequelize.define(
  "Weather",
  {
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    condition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false, tableName: "Weathers" }
);

module.exports = Weather;
