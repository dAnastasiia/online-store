const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "@Da75846129!", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
