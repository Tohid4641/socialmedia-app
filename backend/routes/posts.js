// routes/posts.js

const express = require("express");
const { body, validationResult, param } = require("express-validator");
const sequelize = require("../config/database");
const auth = require("../middleware/auth");
const { Post, User, Like } = require("../models/index.js");

const router = express.Router();

// Create a New Post (Protected) with Validation
router.post(
  "/",
  [
    auth,
    body("content", "Content is required").not().isEmpty(),
    body("content", "Content must be between 1 and 500 characters").isLength({
      min: 1,
      max: 500,
    }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content } = req.body;

    try {
      const post = await Post.create({ content, userId: req.user });
      res.status(201).json(post);
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  }
);

// Get All Posts with Pagination (Protected)
router.get("/", async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
  const offset = (page - 1) * limit;

  try {
    const { count, rows: posts } = await Post.findAndCountAll({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM likes AS likeTable
              WHERE likeTable.postId = Post.id
            )`),
            'likes'
          ]
        ]
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      totalPosts: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      posts,
    });
  } catch (err) {
    next(err); // Pass the error to the error handler
  }
});

// Like a Post (Protected) with Validation
router.post(
  "/:postId/like",
  [auth, param("postId", "Post ID must be an integer").isInt()],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const postId = parseInt(req.params.postId);
    const userId = parseInt(req.user);

    try {
      // Check if the post exists
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      // Check if the user has already liked the post
      const like = await Like.findOne({ where: { postId, userId } });
      console.log(like);
      if (like) {
        await like.destroy();
        return res
          .status(200)
          .json({ message: "Like removed", likes: post.likes });
      } else {
        await Like.create({ postId, userId });
        return res
          .status(200)
          .json({ message: "Post liked", likes: post.likes });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
