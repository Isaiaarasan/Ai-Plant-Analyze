const express = require('express');
const router = express.Router();
const { getSolutionsByDisease, getAllDiseases } = require('../controllers/solutionsController');
const auth = require('../middleware/auth');

// Routes
router.get('/', auth.required, getAllDiseases);
router.get('/:diseaseName', auth.required, getSolutionsByDisease);

module.exports = router;
