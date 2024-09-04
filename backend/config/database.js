const { Sequelize } = require("sequelize");
const config = require("../config");

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    dialect: "mysql",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

// Sync models
sequelize
  .sync({ alter: true })
  .then(() => console.log("Models synchronized with the database."))
  .catch((err) => console.log("Error syncing models: " + err));

module.exports = sequelize;
