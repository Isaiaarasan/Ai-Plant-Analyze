const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  likePost,
  likeComment
} = require('../controllers/forumController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', auth.required, createPost);
router.put('/:id', auth.required, updatePost);
router.delete('/:id', auth.required, deletePost);

// Comment routes
router.post('/:id/comments', auth.required, addComment);
router.delete('/:id/comments/:commentId', auth.required, deleteComment);

// Like routes
router.put('/:id/like', auth.required, likePost);
router.put('/:id/comments/:commentId/like', auth.required, likeComment);

module.exports = router;
