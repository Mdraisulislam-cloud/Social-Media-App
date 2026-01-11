import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, CircularProgress, Alert, Typography, Button, TextField, Grid } from '@mui/material';
import { getPhotoById, addComment, getComments, deletePhoto } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Comment from '../components/Comment';
import LikeButton from '../components/LikeButton';
import { useNavigate } from 'react-router-dom';

const PhotoDetail = () => {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhotoAndComments();
  }, [id]);

  const fetchPhotoAndComments = async () => {
    try {
      setLoading(true);
      const photoResponse = await getPhotoById(id);
      setPhoto(photoResponse.data);

      const commentsResponse = await getComments(id);
      setComments(commentsResponse.data);
    } catch (err) {
      setError('Failed to load photo');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      await addComment(id, commentText);
      setCommentText('');
      fetchPhotoAndComments();
    } catch (err) {
      setError('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await deletePhoto(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete photo');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !photo) {
    return <Alert severity="error">{error || 'Photo not found'}</Alert>;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ position: 'relative' }}>
            <img
              src={`http://localhost:5000${photo.imageUrl}`}
              alt={photo.title}
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '8px' }}
            />
            {user && user.id === photo.creator._id && (
              <Button
                variant="contained"
                color="error"
                onClick={handleDeletePhoto}
                sx={{ mt: 2 }}
              >
                Delete Photo
              </Button>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {photo.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {photo.caption}
          </Typography>
          <Typography variant="subtitle2" color="primary">
            by {photo.creator?.username}
          </Typography>
          {photo.location && (
            <Typography variant="subtitle2">
              📍 {photo.location}
            </Typography>
          )}
          {photo.tags && photo.tags.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {photo.tags.map((tag, idx) => (
                <Typography
                  key={idx}
                  variant="caption"
                  sx={{
                    display: 'inline-block',
                    mr: 1,
                    backgroundColor: '#e0e0e0',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}
                >
                  #{tag}
                </Typography>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <LikeButton photoId={id} onLikeUpdate={fetchPhotoAndComments} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>Comments</Typography>

          {user ? (
            <Box component="form" onSubmit={handleAddComment} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={submittingComment || !commentText.trim()}
              >
                {submittingComment ? 'Adding...' : 'Add Comment'}
              </Button>
            </Box>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              Please <Button component="a" href="/login">login</Button> to add comments
            </Alert>
          )}

          {comments.length === 0 ? (
            <Typography>No comments yet. Be the first to comment!</Typography>
          ) : (
            comments.map(comment => (
              <Comment
                key={comment._id}
                comment={comment}
                photoId={id}
                onCommentDeleted={fetchPhotoAndComments}
              />
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PhotoDetail;
