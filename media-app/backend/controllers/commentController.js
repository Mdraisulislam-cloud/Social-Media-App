const Comment = require('../models/Comment');
const Photo = require('../models/Photo');
const Notification = require('../models/Notification');

// Add comment to a photo
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: photoId } = req.params;

    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    // Check if photo exists
    const photo = await Photo.findById(photoId).populate('creator', '_id');
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const newComment = new Comment({
      text,
      user: req.userId,
      photo: photoId
    });

    await newComment.save();
    const populatedComment = await newComment.populate('user', 'username email');

    // Create notification if not self-comment
    if (photo.creator._id.toString() !== req.userId) {
      try {
        const notification = new Notification({
          recipient: photo.creator._id,
          actor: req.userId,
          type: 'comment',
          message: 'commented on your photo',
          relatedPhoto: photoId,
          relatedComment: newComment._id
        });
        await notification.save();
      } catch (notifError) {
        console.error('Error creating notification:', notifError.message);
      }
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment: populatedComment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get comments for a photo
exports.getComments = async (req, res) => {
  try {
    const { id: photoId } = req.params;

    const comments = await Comment.find({ photo: photoId })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
