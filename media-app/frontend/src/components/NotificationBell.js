import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Button
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getNotifications, markNotificationAsRead, getNotificationUnreadCount } from '../services/api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const [notifResponse, countResponse] = await Promise.all([
        getNotifications(),
        getNotificationUnreadCount()
      ]);
      setNotifications(notifResponse.data);
      setUnreadCount(countResponse.data.unreadCount);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        sx={{ color: '#000' }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 400, maxHeight: 500, overflowY: 'auto' }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Notifications
          </Typography>
          {notifications.length === 0 ? (
            <Typography variant="body2" sx={{ p: 2, textAlign: 'center', color: 'gray' }}>
              No notifications yet
            </Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification._id}
                  sx={{
                    backgroundColor: notification.isRead ? 'transparent' : '#f5f5f5',
                    borderBottom: '1px solid #eee',
                    p: 0
                  }}
                >
                  <ListItemButton onClick={() => handleMarkAsRead(notification._id)}>
                    <ListItemAvatar>
                      <Avatar
                        src={
                          notification.actor?.profilePicture
                            ? `http://localhost:5000${notification.actor.profilePicture}`
                            : ''
                        }
                        sx={{ backgroundColor: '#1976d2' }}
                      >
                        {notification.actor?.username?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.actor?.username}
                      secondary={notification.message}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationBell;
