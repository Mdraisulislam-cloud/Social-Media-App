const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const auth = require('../middleware/auth');

// Toggle like/dislike (protected)
router.post('/:photoId/like', auth, likeController.toggleLike);

// Get likes/dislikes count for a photo (public)
router.get('/:photoId/likes', likeController.getPhotoLikes);

// Get user's like status for a photo (protected)
router.get('/:photoId/user-like', auth, likeController.getUserLike);

// Get all likes with user details (public)
router.get('/:photoId/likes-users', likeController.getLikesWithUsers);

module.exports = router;
