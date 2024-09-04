const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Follow = sequelize.define('Follow', {
  followerId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  followingId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
});

module.exports = Follow;
