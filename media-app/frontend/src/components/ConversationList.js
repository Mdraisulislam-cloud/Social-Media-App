import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Badge, Typography, Divider } from '@mui/material';

const ConversationList = ({ conversations, selectedUserId, onSelectConversation, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Loading conversations...
        </Typography>
      </Box>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography variant="body2" color="textSecondary">
          No conversations yet. Start chatting!
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%', maxHeight: '100%', overflowY: 'auto' }}>
      {conversations.map((conv, index) => (
        <Box key={conv.userId}>
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedUserId === conv.userId}
              onClick={() => onSelectConversation(conv.userId)}
              sx={{
                backgroundColor: selectedUserId === conv.userId ? '#f0f0f0' : 'white',
                '&:hover': { backgroundColor: '#f9f9f9' },
              }}
            >
              <Badge badgeContent={conv.unreadCount} color="primary">
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: conv.unreadCount > 0 ? 'bold' : 'normal',
                      }}
                    >
                      {conv.username}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {conv.lastMessage}
                    </Typography>
                  }
                />
              </Badge>
            </ListItemButton>
          </ListItem>
          {index < conversations.length - 1 && <Divider />}
        </Box>
      ))}
    </List>
  );
};

export default ConversationList;
