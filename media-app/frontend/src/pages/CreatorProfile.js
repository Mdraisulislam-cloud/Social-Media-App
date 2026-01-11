import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Avatar,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const CreatorProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.getUserProfile(userId);
        setProfileData(response.data);
        
        // Check if current user is following this creator
        if (currentUser && response.data.followers) {
          setIsFollowing(response.data.followers.some(f => f._id === currentUser.id));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId, currentUser]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.unfollowUser(userId);
        setIsFollowing(false);
        setSuccess('Unfollowed successfully');
      } else {
        await api.followUser(userId);
        setIsFollowing(true);
        setSuccess('Followed successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update follow status');
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!profileData) {
    return <Alert severity="warning">Creator not found</Alert>;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          {/* Profile Picture */}
          <Avatar
            src={profileData.profilePicture ? `http://localhost:5000${profileData.profilePicture}` : ''}
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto 16px',
              backgroundColor: '#1976d2',
              fontSize: '48px',
            }}
          >
            {!profileData.profilePicture && profileData.username?.charAt(0).toUpperCase()}
          </Avatar>

          {/* Username and Role */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {profileData.username}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            {profileData.role === 'creator' ? '📸 Creator' : '👁️ Consumer'}
          </Typography>

          {/* Bio */}
          {profileData.bio && (
            <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
              {profileData.bio}
            </Typography>
          )}

          {/* Website and Location */}
          <Box sx={{ mb: 2 }}>
            {profileData.website && (
              <Typography variant="body2" sx={{ color: '#1976d2' }}>
                🔗 <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a>
              </Typography>
            )}
            {profileData.location && (
              <Typography variant="body2" sx={{ color: '#666' }}>
                📍 {profileData.location}
              </Typography>
            )}
          </Box>

          {/* Follow Stats */}
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid item xs={6}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {profileData.followers?.length || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Followers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {profileData.following?.length || 0}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Following
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Follow/Unfollow Button */}
          {currentUser && currentUser.id !== userId && (
            <Button
              variant="contained"
              color={isFollowing ? 'error' : 'primary'}
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleFollow}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}

          {currentUser?.id === userId && (
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              onClick={() => navigate('/profile')}
            >
              Go to My Profile
            </Button>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreatorProfile;
