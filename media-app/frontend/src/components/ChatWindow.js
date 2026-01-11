import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';

const ChatWindow = ({ messages, currentUserId, otherUserName, onDeleteMessage, isLoadingDelete = false }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Typography variant="body1" color="textSecondary">
          No messages yet. Start the conversation with {otherUserName}!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        backgroundColor: '#f5f5f5',
      }}
    >
      {messages.map((msg) => (
        <Box
          key={msg._id}
          sx={{
            display: 'flex',
            justifyContent: msg.sender._id === currentUserId ? 'flex-end' : 'flex-start',
            alignItems: 'flex-end',
            gap: 1,
          }}
        >
          {msg.sender._id === currentUserId && (
            <Button
              size="small"
              onClick={() => onDeleteMessage(msg._id)}
              disabled={isLoadingDelete}
              sx={{ minWidth: 'auto', padding: '4px 8px', fontSize: '12px' }}
            >
              🗑️ Delete
            </Button>
          )}
          <Paper
            sx={{
              padding: 1.5,
              maxWidth: '60%',
              backgroundColor: msg.sender._id === currentUserId ? '#1976d2' : '#e0e0e0',
              color: msg.sender._id === currentUserId ? 'white' : 'black',
              borderRadius: '12px',
            }}
          >
            <Typography variant="body2">{msg.message}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, marginTop: 0.5, display: 'block' }}>
              {new Date(msg.createdAt).toLocaleTimeString()}
            </Typography>
          </Paper>
          {msg.sender._id !== currentUserId && (
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
              {msg.sender.username}
            </Typography>
          )}
        </Box>
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatWindow;
