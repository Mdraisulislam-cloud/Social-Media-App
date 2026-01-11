import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { getPhotoLikes } from '../services/api';

const PhotoCard = ({ photo }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    const loadLikes = async () => {
      try {
        const response = await getPhotoLikes(photo._id);
        setLikes(response.data.likes);
        setDislikes(response.data.dislikes);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };
    
    loadLikes();
  }, [photo._id]);

  return (
    <Card sx={{ maxWidth: 300, margin: 'auto', cursor: 'pointer', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
      <CardMedia
        component="img"
        height="250"
        image={`http://localhost:5000${photo.imageUrl}`}
        alt={photo.title}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {photo.title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {photo.caption?.substring(0, 100)}...
        </Typography>
        <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }} component={Link} to={`/creator/${photo.creator?._id}`}>
          by {photo.creator?.username}
        </Typography>
        {photo.location && (
          <Typography variant="caption" display="block" color="textSecondary">
            📍 {photo.location}
          </Typography>
        )}
        {photo.tags && photo.tags.length > 0 && (
          <Box sx={{ mt: 1 }}>
            {photo.tags.slice(0, 3).map((tag, idx) => (
              <Typography key={idx} variant="caption" sx={{ display: 'inline-block', mr: 1, backgroundColor: '#e0e0e0', px: 1, py: 0.5, borderRadius: 1 }}>
                #{tag}
              </Typography>
            ))}
          </Box>
        )}
        
        <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
          <span>👍</span>
          <Typography variant="caption">{likes}</Typography>
          <span style={{ marginLeft: '8px' }}>👎</span>
          <Typography variant="caption">{dislikes}</Typography>
        </Box>

        <Button size="small" component={Link} to={`/photo/${photo._id}`} sx={{ mt: 1 }}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default PhotoCard;
