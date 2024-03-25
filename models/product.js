const { randomUUID } = require("crypto");

const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    defaultValue: randomUUID(),
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  photoUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
