import axios from 'axios';

const API_BASE = '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const registerUser = (username, email, password, role) =>
  axiosInstance.post('/auth/register', { username, email, password, role });

export const loginUser = (email, password) =>
  axiosInstance.post('/auth/login', { email, password });

export const getProfile = () =>
  axiosInstance.get('/auth/profile');

export const uploadProfilePicture = (formData) =>
  axiosInstance.post('/auth/upload-profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updateProfile = (data) =>
  axiosInstance.put('/auth/profile', data);

export const getUserProfile = (userId) =>
  axiosInstance.get(`/auth/user/${userId}`);

export const followUser = (userId) =>
  axiosInstance.post(`/auth/follow/${userId}`);

export const unfollowUser = (userId) =>
  axiosInstance.post(`/auth/unfollow/${userId}`);

// Photo APIs
export const uploadPhoto = (formData) =>
  axiosInstance.post('/photos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getPhotos = () =>
  axiosInstance.get('/photos');

export const getPhotoById = (id) =>
  axiosInstance.get(`/photos/${id}`);

export const deletePhoto = (id) =>
  axiosInstance.delete(`/photos/${id}`);

export const searchPhotos = (query) =>
  axiosInstance.get(`/photos/search?q=${query}`);

// Comment APIs
export const addComment = (photoId, text) =>
  axiosInstance.post(`/photos/${photoId}/comments`, { text });

export const getComments = (photoId) =>
  axiosInstance.get(`/photos/${photoId}/comments`);

export const deleteComment = (commentId) =>
  axiosInstance.delete(`/photos/comments/${commentId}`);

// Like APIs
export const toggleLike = (photoId, likeType) =>
  axiosInstance.post(`/likes/${photoId}/like`, { likeType });

export const getPhotoLikes = (photoId) =>
  axiosInstance.get(`/likes/${photoId}/likes`);

export const getUserLike = (photoId) =>
  axiosInstance.get(`/likes/${photoId}/user-like`);

export const getLikesWithUsers = (photoId) =>
  axiosInstance.get(`/likes/${photoId}/likes-users`);

// Chat APIs
export const sendMessage = (receiverId, message) =>
  axiosInstance.post('/chat/send', { receiverId, message });

export const getChatHistory = (userId) =>
  axiosInstance.get(`/chat/history/${userId}`);

export const getConversations = () =>
  axiosInstance.get('/chat/conversations');

export const markAsRead = (userId) =>
  axiosInstance.put(`/chat/mark-read/${userId}`);

export const getUnreadCount = () =>
  axiosInstance.get('/chat/unread-count');

export const deleteMessage = (messageId) =>
  axiosInstance.delete(`/chat/${messageId}`);

// Notification APIs
export const getNotifications = () =>
  axiosInstance.get('/notifications');

export const getNotificationUnreadCount = () =>
  axiosInstance.get('/notifications/unread-count');

export const markNotificationAsRead = (notificationId) =>
  axiosInstance.put(`/notifications/${notificationId}/read`);

export const markAllNotificationsAsRead = () =>
  axiosInstance.put('/notifications/all/read');

export const deleteNotification = (notificationId) =>
  axiosInstance.delete(`/notifications/${notificationId}`);

export default axiosInstance;
