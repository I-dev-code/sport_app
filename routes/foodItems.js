// routes/foodItems.js

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const foodItemController = require('../controllers/foodItemController');

// Validation middleware for creating/updating a food item
const validateFoodItem = [
  check('foodName')
    .notEmpty()
    .withMessage('Le nom de l\'aliment est requis.')
    .isString()
    .withMessage('Le nom de l\'aliment doit être une chaîne de caractères.'),
  check('servingSize')
    .isFloat({ min: 0 })
    .withMessage('La taille de la portion doit être un nombre positif.'),
  check('calories')
    .isFloat({ min: 0 })
    .withMessage('Les calories doivent être un nombre positif.'),
  check('protein')
    .isFloat({ min: 0 })
    .withMessage('Les protéines doivent être un nombre positif.'),
  check('carbs')
    .isFloat({ min: 0 })
    .withMessage('Les glucides doivent être un nombre positif.'),
  check('fats')
    .isFloat({ min: 0 })
    .withMessage('Les lipides doivent être un nombre positif.'),
  check('mealId')
    .isInt()
    .withMessage('L\'ID du repas est requis et doit être un entier.'),
];

// Create a new food item
router.post('/', authMiddleware, validateFoodItem, foodItemController.createFoodItem);

// Get a specific food item by ID
router.get('/:id', authMiddleware, foodItemController.getFoodItemById);

// Update a food item by ID
router.put('/:id', authMiddleware, validateFoodItem, foodItemController.updateFoodItem);

// Delete a food item by ID
router.delete('/:id', authMiddleware, foodItemController.deleteFoodItem);

module.exports = router;
