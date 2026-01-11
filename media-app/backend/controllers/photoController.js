const Photo = require('../models/Photo');
const User = require('../models/User');
const path = require('path');

// Upload a new photo (creator only)
exports.uploadPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role !== 'creator') {
      return res.status(403).json({ message: 'Only creators can upload photos' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, caption, location, tags } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const newPhoto = new Photo({
      title,
      caption,
      imageUrl,
      location,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      creator: req.userId
    });

    await newPhoto.save();
    const populatedPhoto = await newPhoto.populate('creator', 'username email');

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photo: populatedPhoto
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all photos
exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find()
      .populate('creator', 'username email')
      .sort({ createdAt: -1 });

    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single photo
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('creator', 'username email');

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.json(photo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete photo (creator only)
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    if (photo.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this photo' });
    }

    await Photo.findByIdAndDelete(req.params.id);

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search photos
exports.searchPhotos = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const photos = await Photo.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { caption: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
      .populate('creator', 'username email')
      .sort({ createdAt: -1 });

    res.json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
