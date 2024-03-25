const { randomUUID } = require("crypto");

const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => randomUUID(),
  },
});

module.exports = Order;
