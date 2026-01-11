import React, { useEffect, useState, useContext } from 'react';
import { Container, Box, Typography, Alert, CircularProgress, Avatar, Button, Dialog, Divider } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { AuthContext } from '../context/AuthContext';
import { getProfile, uploadProfilePicture, followUser, unfollowUser } from '../services/api';
import EditProfileModal from '../components/EditProfileModal';

const Profile = () => {
  const { user, updateUserProfilePicture } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      setProfileData(response.data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await uploadProfilePicture(formData);
      setProfileData(prev => ({
        ...prev,
        profilePicture: response.data.profilePicture
      }));
      updateUserProfilePicture(response.data.profilePicture);
      setSuccess('Profile picture uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleEditProfile = (updatedUser) => {
    setProfileData(prev => ({
      ...prev,
      ...updatedUser
    }));
  };

  if (!user) {
    return <Alert severity="warning">Please login to view your profile</Alert>;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !profileData) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, border: '1px solid #ddd', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 4 }}>My Profile</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Profile Picture Section */}
        <Box sx={{ mb: 4 }}>
          <Avatar
            src={profileData?.profilePicture ? `http://localhost:5000${profileData.profilePicture}` : ''}
            sx={{
              width: 150,
              height: 150,
              margin: '0 auto',
              marginBottom: 2,
              fontSize: '60px',
              backgroundColor: '#1976d2'
            }}
          >
            {!profileData?.profilePicture && profileData?.username?.charAt(0).toUpperCase()}
          </Avatar>
          
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="profile-picture-input"
            type="file"
            onChange={handleProfilePictureChange}
            disabled={uploading}
          />
          <label htmlFor="profile-picture-input">
            <Button
              variant="contained"
              color="primary"
              component="span"
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Change Profile Picture'}
            </Button>
          </label>
        </Box>

        {profileData && (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Username: <strong>{profileData.username}</strong></Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Email: <strong>{profileData.email}</strong></Typography>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Role: <strong>{profileData.role === 'creator' ? 'Creator 📸' : 'Consumer 👁️'}</strong>
            </Typography>

            {profileData.bio && (
              <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
                {profileData.bio}
              </Typography>
            )}

            {(profileData.location || profileData.website) && (
              <Box sx={{ mb: 2 }}>
                {profileData.location && (
                  <Typography variant="caption">📍 {profileData.location}</Typography>
                )}
                {profileData.website && (
                  <Typography variant="caption" display="block">
                    🔗 <a href={profileData.website} target="_blank" rel="noopener noreferrer">{profileData.website}</a>
                  </Typography>
                )}
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Follow Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
              <Box>
                <Typography variant="h6">{profileData.following?.length || 0}</Typography>
                <Typography variant="caption">Following</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{profileData.followers?.length || 0}</Typography>
                <Typography variant="caption">Followers</Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => setOpenEditModal(true)}
              fullWidth
              sx={{ mb: 2 }}
            >
              Edit Profile
            </Button>

            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 2 }}>
              Member since: {new Date(profileData.createdAt).toLocaleDateString()}
            </Typography>
          </>
        )}
      </Box>

      {/* Edit Profile Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <EditProfileModal
          profileData={profileData}
          onClose={() => setOpenEditModal(false)}
          onUpdate={handleEditProfile}
        />
      </Dialog>
    </Container>
  );
};

export default Profile;
