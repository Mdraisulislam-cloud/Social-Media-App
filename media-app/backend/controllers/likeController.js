const Like = require('../models/Like');
const Photo = require('../models/Photo');
const Notification = require('../models/Notification');

// Like or dislike a photo
exports.toggleLike = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { likeType } = req.body; // 'like' or 'dislike'
    const userId = req.userId;

    if (!['like', 'dislike'].includes(likeType)) {
      return res.status(400).json({ message: 'Invalid likeType. Must be like or dislike' });
    }

    // Check if photo exists
    const photo = await Photo.findById(photoId).populate('creator', '_id');
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Check if user already liked/disliked
    const existingLike = await Like.findOne({ user: userId, photo: photoId });

    if (existingLike) {
      // If same type, remove it (unlike/undislike)
      if (existingLike.likeType === likeType) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.json({ message: `${likeType} removed`, liked: false });
      } else {
        // If different type, update it
        existingLike.likeType = likeType;
        await existingLike.save();
        return res.json({ message: `Changed to ${likeType}`, liked: true });
      }
    } else {
      // Create new like/dislike
      const newLike = new Like({
        user: userId,
        photo: photoId,
        likeType
      });
      await newLike.save();

      // Create notification if it's a like and not self-like
      if (likeType === 'like' && photo.creator._id.toString() !== userId) {
        try {
          const notification = new Notification({
            recipient: photo.creator._id,
            actor: userId,
            type: 'like',
            message: 'liked your photo',
            relatedPhoto: photoId
          });
          await notification.save();
        } catch (notifError) {
          console.error('Error creating notification:', notifError.message);
        }
      }

      res.status(201).json({ message: `${likeType} added`, liked: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get likes/dislikes for a photo
exports.getPhotoLikes = async (req, res) => {
  try {
    const { photoId } = req.params;

    const likes = await Like.countDocuments({ photo: photoId, likeType: 'like' });
    const dislikes = await Like.countDocuments({ photo: photoId, likeType: 'dislike' });

    res.json({ likes, dislikes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if user liked/disliked a photo
exports.getUserLike = async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.userId;

    const userLike = await Like.findOne({ user: userId, photo: photoId });

    if (!userLike) {
      return res.json({ liked: null });
    }

    res.json({ liked: userLike.likeType });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all likes for a photo (with user details)
exports.getLikesWithUsers = async (req, res) => {
  try {
    const { photoId } = req.params;

    const likes = await Like.find({ photo: photoId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
