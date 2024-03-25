const { randomUUID } = require("crypto");

const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const CartItem = sequelize.define("cartItem", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: () => randomUUID(),
  },
  quantity: Sequelize.INTEGER,
});

module.exports = CartItem;
