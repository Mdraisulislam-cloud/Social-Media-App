const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo',
    required: true
  },
  likeType: {
    type: String,
    enum: ['like', 'dislike'],
    default: 'like'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only like/dislike a photo once
likeSchema.index({ user: 1, photo: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
