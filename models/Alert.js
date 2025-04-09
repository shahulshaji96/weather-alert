const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Alert = sequelize.define(
  "Alert",
  {
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alertType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Alert;
