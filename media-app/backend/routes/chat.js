const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const chatController = require('../controllers/chatController');

// Send a message
router.post('/send', auth, chatController.sendMessage);

// Get chat history with a specific user
router.get('/history/:userId', auth, chatController.getChatHistory);

// Get all conversations
router.get('/conversations', auth, chatController.getConversations);

// Mark messages from a user as read
router.put('/mark-read/:userId', auth, chatController.markAsRead);

// Get unread message count
router.get('/unread-count', auth, chatController.getUnreadCount);

// Delete a message
router.delete('/:messageId', auth, chatController.deleteMessage);

module.exports = router;
