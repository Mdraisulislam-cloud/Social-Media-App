import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { getPhotos, searchPhotos } from '../services/api';
import PhotoCard from '../components/PhotoCard';
import { useSearchParams } from 'react-router-dom';

const Home = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchPhotos();
  }, [searchParams]);

  const fetchPhotos = async () => {
    setLoading(true);
    setError('');

    try {
      const query = searchParams.get('search');
      let response;

      if (query) {
        response = await searchPhotos(query);
      } else {
        response = await getPhotos();
      }

      setPhotos(response.data);
    } catch (err) {
      setError('Failed to fetch photos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && <Alert severity="error">{error}</Alert>}

      {photos.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          No photos found
        </Typography>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {searchParams.get('search') ? `Search Results for "${searchParams.get('search')}"` : 'Latest Photos'}
          </Typography>
          <Grid container spacing={3}>
            {photos.map(photo => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={photo._id}>
                <PhotoCard photo={photo} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default Home;
