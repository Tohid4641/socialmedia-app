// routes/users.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult, param } = require("express-validator");
const User = require("../models/User");
const config = require("../config");
const auth = require("../middleware/auth");
const Follow = require("../models/Follow");

const router = express.Router();

// User Registration with Validation
router.post(
  "/register",
  [
    body("username", "Username is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Check if the user already exists
      let user = await User.findOne({ where: { email } });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      user = await User.create({ username, email, password: hashedPassword });

      // Create a JWT token
      const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: "1h",
      });

      res.status(201).json({ token });
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  }
);

// User Login with Validation
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check if the user exists
      let user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create a JWT token
      const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: "1h",
      });

      res.status(200).json({ token, username:user.username });
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  }
);

// Follow a User (Protected) with Validation
router.post(
  "/:userId/follow",
  [auth, param("userId", "User ID must be an integer").isInt()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;

    try {
      // Check if the user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user is already followed
      const follow = await Follow.findOne({
        where: { followerId: req.user, followingId: userId },
      });
      if (follow) {
        return res.status(400).json({ message: "User already followed" });
      }

      // Prevent users from following themselves
      if (req.user === parseInt(userId)) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }

      // Follow the user
      await Follow.create({ followerId: req.user, followingId: userId });
      res.status(200).json({ message: "User followed" });
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  }
);

router.delete(
  "/:userId/unfollow",
  [auth, param("userId", "User ID must be an integer").isInt()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;

    try {
      // Check if the user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user is currently followed
      const follow = await Follow.findOne({
        where: { followerId: req.user, followingId: userId },
      });
      if (!follow) {
        return res.status(400).json({ message: "You are not following this user" });
      }

      // Prevent users from unfollowing themselves (optional, depending on your logic)
      if (req.user === parseInt(userId)) {
        return res.status(400).json({ message: "You cannot unfollow yourself" });
      }

      // Unfollow the user
      await follow.destroy();
      res.status(200).json({ message: "User unfollowed" });
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  }
);


// Get user profile by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({
      where: { username },
      attributes: ['id', 'username', 'email'],
      include: [
        {
          model: User,
          as: 'followers',
          attributes: ['id', 'username'],
          through: {
            attributes: [],
          },
        },
        {
          model: User,
          as: 'following',
          attributes: ['id', 'username'],
          through: {
            attributes: [],
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user by username:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if the logged-in user is following the specified user
router.get(
  '/:username/is-following',
  [auth, param('username', 'Username is required').notEmpty()],
  async (req, res, next) => {
    try {
      const { username } = req.params;

      // Find the user by username
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Check if the logged-in user is following this user
      const isFollowing = await Follow.findOne({
        where: {
          followerId: req.user, // `req.user` contains the logged-in user's information
          followingId: user.id,
        },
      });

      res.status(200).json({ isFollowing: !!isFollowing }); // Respond with true or false
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  }
);

module.exports = router;
