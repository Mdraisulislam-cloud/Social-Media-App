import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { deleteComment } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Comment = ({ comment, photoId, onCommentDeleted }) => {
  const { user } = useContext(AuthContext);

  const handleDelete = async () => {
    try {
      await deleteComment(comment._id);
      onCommentDeleted();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {comment.user?.username}
            </Typography>
            <Typography variant="body2">
              {comment.text}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(comment.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          {user && user.id === comment.user?._id && (
            <Button size="small" color="error" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Comment;
