import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { toggleLike, getPhotoLikes, getUserLike } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const LikeButton = ({ photoId, onLikeUpdate }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userLike, setUserLike] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const loadLikes = async () => {
      try {
        const response = await getPhotoLikes(photoId);
        setLikeCount(response.data.likes);
        setDislikeCount(response.data.dislikes);
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadUserLike = async () => {
      if (!user) return;
      try {
        const response = await getUserLike(photoId);
        setUserLike(response.data.liked);
      } catch (error) {
        console.error('Error fetching user like:', error);
      }
    };

    loadLikes();
    loadUserLike();
  }, [photoId, user]);

  const fetchLikes = async () => {
    try {
      const response = await getPhotoLikes(photoId);
      setLikeCount(response.data.likes);
      setDislikeCount(response.data.dislikes);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchUserLike = async () => {
    try {
      const response = await getUserLike(photoId);
      setUserLike(response.data.liked);
    } catch (error) {
      console.error('Error fetching user like:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like');
      return;
    }

    try {
      await toggleLike(photoId, 'like');
      fetchLikes();
      fetchUserLike();
      if (onLikeUpdate) onLikeUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      alert('Please login to dislike');
      return;
    }

    try {
      await toggleLike(photoId, 'dislike');
      fetchLikes();
      fetchUserLike();
      if (onLikeUpdate) onLikeUpdate();
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', my: 2 }}>
      <Button
        variant={userLike === 'like' ? 'contained' : 'outlined'}
        color="primary"
        onClick={handleLike}
        sx={{ textTransform: 'none' }}
      >
        👍 Like ({likeCount})
      </Button>

      <Button
        variant={userLike === 'dislike' ? 'contained' : 'outlined'}
        color="error"
        onClick={handleDislike}
        sx={{ textTransform: 'none' }}
      >
        👎 Dislike ({dislikeCount})
      </Button>
    </Box>
  );
};

export default LikeButton;
