const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Protected routes
router.post('/:id/comments', auth, commentController.addComment);
router.get('/:id/comments', commentController.getComments);
router.delete('/comments/:commentId', auth, commentController.deleteComment);

module.exports = router;
