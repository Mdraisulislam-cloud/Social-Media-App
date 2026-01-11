import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';

const MessageInput = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSendMessage}
      sx={{
        display: 'flex',
        gap: 1,
        padding: 2,
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f9f9f9',
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isLoading}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
          },
        }}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={!message.trim() || isLoading}
        sx={{ borderRadius: '20px' }}
      >
        {isLoading ? '⏳' : '📤'} Send
      </Button>
    </Box>
  );
};

export default MessageInput;
