import React, { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { uploadPhoto } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    location: '',
    tags: '',
    image: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title || !formData.image) {
      setError('Title and image are required');
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('caption', formData.caption);
      form.append('location', formData.location);
      form.append('tags', formData.tags);
      form.append('image', formData.image);

      const response = await uploadPhoto(form);
      setSuccess('Photo uploaded successfully!');
      setFormData({ title: '', caption: '', location: '', tags: '', image: null });
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'creator') {
    return <Alert severity="error">Only creators can upload photos</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Upload New Photo</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Caption"
          name="caption"
          value={formData.caption}
          onChange={handleInputChange}
          multiline
          rows={4}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Tags (comma-separated)"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          placeholder="nature, sunset, travel"
          sx={{ mb: 2 }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          style={{ marginBottom: '16px', display: 'block' }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </Button>
      </form>
    </Box>
  );
};

export default UploadForm;
