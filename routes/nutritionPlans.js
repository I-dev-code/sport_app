// routes/nutritionPlans.js

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const nutritionController = require('../controllers/nutritionController');

// Validation middleware
const validateNutritionPlan = [
  check('title').notEmpty().withMessage('Le titre est requis.'),
  // Add other validations as needed
];

// Routes
router.post('/', authMiddleware, validateNutritionPlan, nutritionController.createNutritionPlan);

// Define other routes (GET, PUT, DELETE)

module.exports = router;
