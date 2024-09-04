const Like = require('./Like');
const User = require('./User');
const Post = require('./Post');
const Follow = require('./Follow');

// Associations
// User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
// Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
// Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
// Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
// Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User.hasMany(Follow, { foreignKey: 'followerId', as: 'followers' });
// User.hasMany(Follow, { foreignKey: 'followingId', as: 'followings' });
// Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
// Follow.belongsTo(User, { foreignKey: 'followingId', as: 'following' });

// Associations
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// Many-to-Many association for followers and following
User.belongsToMany(User, {
  through: Follow,
  as: 'followers',
  foreignKey: 'followingId',
  otherKey: 'followerId'
});

User.belongsToMany(User, {
  through: Follow,
  as: 'following',
  foreignKey: 'followerId',
  otherKey: 'followingId'
});

module.exports = {
    Like,
    User,
    Post,
    Follow
};
