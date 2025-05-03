// models/index.js
const sequelize = require('../config/database');
const User = require('./User');
const Todo = require('./Todo');

// Define relationships
User.hasMany(Todo, { foreignKey: 'userId', as: 'todos' });
Todo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Todo,
};