const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user/:userId', authController.getUserProfile);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.post('/upload-profile-picture', auth, upload.single('profilePicture'), authController.uploadProfilePicture);
router.put('/profile', auth, authController.updateProfile);
router.post('/follow/:userId', auth, authController.followUser);
router.post('/unfollow/:userId', auth, authController.unfollowUser);

module.exports = router;
