// const { randomUUID } = require("crypto");

const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoincrement: true,
    allowNull: false,
    primaryKey: true,
    defaultValue: 1,
    //  type: Sequelize.STRING, // for further auth
    //  defaultValue: randomUUID(),  // for further auth
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;
