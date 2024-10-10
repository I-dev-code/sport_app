// controllers/mealController.js

const Meal = require('../models/Meal');
const NutritionPlan = require('../models/NutritionPlan');
const { validationResult } = require('express-validator');

exports.createMeal = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { mealType, description, nutritionPlanId } = req.body;

    // Optional: Verify that the nutrition plan exists and belongs to the user
    const nutritionPlan = await NutritionPlan.findOne({
      where: {
        id: nutritionPlanId,
        userId: req.user.id,
      },
    });

    if (!nutritionPlan) {
      return res.status(404).json({ message: 'Plan nutritionnel introuvable.' });
    }

    const meal = await Meal.create({
      mealType,
      description,
      nutritionPlanId,
    });

    res.status(201).json(meal);
  } catch (error) {
    console.error('Erreur lors de la création du repas:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Implement other controller functions: getMeals, updateMeal, deleteMeal
