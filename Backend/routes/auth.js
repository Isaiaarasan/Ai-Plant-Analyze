const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', signup); // Changed to match frontend service call
router.post('/signup', signup);   // Keep for backward compatibility
router.post('/login', login);

// Protected routes
router.get('/profile', auth.required, getProfile);
router.put('/profile', auth.required, updateProfile);

module.exports = router;
