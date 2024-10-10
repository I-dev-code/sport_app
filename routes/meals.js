// routes/meals.js

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const mealController = require('../controllers/mealController');

// Validation middleware
const validateMeal = [
  check('mealType')
    .isIn(['Petit déjeuner', 'Déjeuner', 'Dîner', 'Collation'])
    .withMessage('Type de repas invalide.'),
  // Add other validations as needed
];

// Routes
router.post('/', authMiddleware, validateMeal, mealController.createMeal);

// Other routes (GET, PUT, DELETE)

module.exports = router;
