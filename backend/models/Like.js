const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Post = require('./Post');
const User = require('./User');

const Like = sequelize.define('Like', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: Post,
      key: 'id',
    },
    allowNull: false,
  },
});


module.exports = Like;
