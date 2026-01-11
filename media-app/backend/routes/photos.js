const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', photoController.getAllPhotos);
router.get('/search', photoController.searchPhotos);
router.get('/:id', photoController.getPhotoById);

// Protected routes
router.post('/', auth, upload.single('image'), photoController.uploadPhoto);
router.delete('/:id', auth, photoController.deletePhoto);

module.exports = router;
