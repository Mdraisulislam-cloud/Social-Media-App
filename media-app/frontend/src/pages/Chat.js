import React, { useState, useEffect, useContext } from 'react';
import { Box, Paper, CircularProgress, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../context/AuthContext';
import { getConversations, getChatHistory, sendMessage, markAsRead, deleteMessage } from '../services/api';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [deletingMessage, setDeletingMessage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newChatUserId, setNewChatUserId] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(false);

  // Load conversations on mount and periodically
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 3000); // Auto-refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Load chat history when conversation is selected
  useEffect(() => {
    if (selectedUserId) {
      loadChatHistory();
      markMessagesAsRead();
    }
  }, [selectedUserId]);

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const response = await getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const response = await getChatHistory(selectedUserId);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await markAsRead(selectedUserId);
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const handleSendMessage = async (messageText) => {
    try {
      setSendingMessage(true);
      const response = await sendMessage(selectedUserId, messageText);
      setMessages([...messages, response.data]);
      loadConversations(); // Refresh conversations to update last message
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setDeletingMessage(true);
      await deleteMessage(messageId);
      setMessages(messages.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
    } finally {
      setDeletingMessage(false);
    }
  };

  const handleStartNewChat = async () => {
    if (!newChatUserId.trim()) {
      alert('Please enter a user ID');
      return;
    }

    setSelectedUserId(newChatUserId);
    setNewChatUserId('');
    setOpenDialog(false);
  };

  if (!user) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography>Please log in to use chat</Typography>
      </Box>
    );
  }

  const selectedConversation = conversations.find((c) => c.userId === selectedUserId);

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 64px)',
        backgroundColor: '#fff',
      }}
    >
      {/* Conversations Sidebar */}
      <Paper
        sx={{
          width: { xs: '100%', sm: 300 },
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fff',
          borderRight: '1px solid #e0e0e0',
        }}
      >
        <Box sx={{ padding: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            💬 Messages
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{ marginTop: 1 }}
          >
            New Chat
          </Button>
        </Box>
        <ConversationList
          conversations={conversations}
          selectedUserId={selectedUserId}
          onSelectConversation={setSelectedUserId}
          isLoading={loadingConversations}
        />
      </Paper>

      {/* Chat Window */}
      {selectedUserId ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              padding: 2,
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography variant="h6">
              Chat with {selectedConversation?.username || 'User'}
            </Typography>
          </Box>

          {/* Messages */}
          {loading ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <ChatWindow
              messages={messages}
              currentUserId={user._id}
              otherUserName={selectedConversation?.username || 'User'}
              onDeleteMessage={handleDeleteMessage}
              isLoadingDelete={deletingMessage}
            />
          )}

          {/* Message Input */}
          <MessageInput onSendMessage={handleSendMessage} isLoading={sendingMessage} />
        </Box>
      ) : (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Typography variant="h6" color="textSecondary">
            Select a conversation to start chatting
          </Typography>
        </Box>
      )}

      {/* New Chat Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Start a New Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User ID"
            fullWidth
            variant="outlined"
            value={newChatUserId}
            onChange={(e) => setNewChatUserId(e.target.value)}
            placeholder="Paste the user's ID here"
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleStartNewChat} variant="contained" color="primary">
            Start Chat
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Chat;
