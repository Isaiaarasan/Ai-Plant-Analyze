import axios from 'axios';

// Create axios instance with base URL
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  // Register a new user
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during signup' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  }
};

// Plant detection services
export const plantService = {
  // Detect plant disease
  detectDisease: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to detect disease' };
    }
  },

  // Get scan history
  getScanHistory: async () => {
    try {
      const response = await api.get('/detect/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch scan history' };
    }
  },

  // Get scan by ID
  getScanById: async (scanId) => {
    try {
      const response = await api.get(`/detect/${scanId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch scan details' };
    }
  },

  // Delete scan
  deleteScan: async (scanId) => {
    try {
      const response = await api.delete(`/detect/${scanId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete scan' };
    }
  }
};

// Solutions services
export const solutionsService = {
  // Get solutions for a specific disease
  getSolutionsByDisease: async (diseaseName) => {
    try {
      const response = await api.get(`/solutions/${diseaseName}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch solutions' };
    }
  },

  // Get all diseases
  getAllDiseases: async () => {
    try {
      const response = await api.get('/solutions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch diseases list' };
    }
  }
};

// For direct API access if needed
export default api;
