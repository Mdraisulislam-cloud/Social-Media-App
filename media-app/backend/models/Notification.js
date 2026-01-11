const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'message'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedPhoto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photo'
  },
  relatedComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expire: 2592000 // Auto-delete after 30 days
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
