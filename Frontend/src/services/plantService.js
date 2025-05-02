import axios from 'axios';

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'https://ai-plant-analyze.onrender.com/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const plantService = {
  // Authentication
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  // Profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },
  
  // Plant Disease Detection
  detectDisease: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Override content-type header for file upload
    const response = await api.post('/detect', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },
  
  // Scan History
  getScanHistory: async () => {
    const response = await api.get('/detect/history');
    return response.data;
  },
  
  getScanById: async (scanId) => {
    const response = await api.get(`/detect/${scanId}`);
    return response.data;
  },
  
  deleteScan: async (scanId) => {
    const response = await api.delete(`/detect/${scanId}`);
    return response.data;
  },
  
  updateScan: async (scanId, scanData) => {
    const response = await api.put(`/detect/${scanId}`, scanData);
    return response.data;
  },
  
  // Forum
  getPosts: async () => {
    const response = await api.get('/forum');
    return response.data;
  },
  
  getPostById: async (postId) => {
    const response = await api.get(`/forum/${postId}`);
    return response.data;
  },
  
  createPost: async (postData) => {
    const response = await api.post('/forum', postData);
    return response.data;
  },
  
  updatePost: async (postId, postData) => {
    const response = await api.put(`/forum/${postId}`, postData);
    return response.data;
  },
  
  deletePost: async (postId) => {
    const response = await api.delete(`/forum/${postId}`);
    return response.data;
  },
  
  // Comments
  addComment: async (postId, commentData) => {
    const response = await api.post(`/forum/${postId}/comments`, commentData);
    return response.data;
  },
  
  deleteComment: async (postId, commentId) => {
    const response = await api.delete(`/forum/${postId}/comments/${commentId}`);
    return response.data;
  },
  
  // Likes
  likePost: async (postId) => {
    const response = await api.put(`/forum/${postId}/like`);
    return response.data;
  },
  
  likeComment: async (postId, commentId) => {
    const response = await api.put(`/forum/${postId}/comments/${commentId}/like`);
    return response.data;
  }
};

export default plantService;
