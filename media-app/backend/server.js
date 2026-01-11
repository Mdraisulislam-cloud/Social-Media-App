require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
const commentRoutes = require('./routes/comments');
const likeRoutes = require('./routes/likes');
const chatRoutes = require('./routes/chat');
const notificationRoutes = require('./routes/notifications');
const upload = require('./middleware/upload');
const authController = require('./controllers/authController');
const auth = require('./middleware/auth');

app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/photos', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);

// Alternative auth route names for convenience
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.get('/api/profile', auth, authController.getProfile);
app.post('/api/auth/upload-profile-picture', auth, upload.single('profilePicture'), authController.uploadProfilePicture);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Raisbook Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'File upload error' });
  }
  res.status(500).json({ message: 'Server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
