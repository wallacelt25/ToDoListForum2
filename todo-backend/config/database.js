// config/database.js
const Sequelize = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'todo_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Goodlikeme16',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql', // you can change this to 'postgres', 'sqlite', etc.
    logging: false,
  }
);

module.exports = sequelize;
