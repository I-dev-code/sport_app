// controllers/foodItemController.js
const { validationResult } = require('express-validator');
const { FoodItem, Meal, NutritionPlan } = require('../models');
// controllers/foodItemController.js

exports.createFoodItem = async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const {
        foodName,
        servingSize,
        calories,
        protein,
        carbs,
        fats,
        mealId,
      } = req.body;
  
      // Verify that the meal exists and belongs to the user
      const meal = await Meal.findOne({
        where: {
          id: mealId,
        },
        include: {
          model: require('../models/NutritionPlan'),
          where: { userId: req.user.id },
        },
      });
  
      if (!meal) {
        return res.status(404).json({ message: 'Repas introuvable ou non autorisé.' });
      }
  
      const foodItem = await FoodItem.create({
        foodName,
        servingSize,
        calories,
        protein,
        carbs,
        fats,
        mealId,
      });
  
      res.status(201).json(foodItem);
    } catch (error) {
      console.error('Erreur lors de la création de l\'aliment:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };


  exports.getFoodItemById = async (req, res) => {
    try {
      const foodItemId = req.params.id;
  
      // Find the food item and include the meal and nutrition plan to verify ownership
      const foodItem = await FoodItem.findOne({
        where: { id: foodItemId },
        include: {
          model: Meal,
          include: {
            model: require('../models/NutritionPlan'),
            where: { userId: req.user.id },
          },
        },
      });
  
      if (!foodItem) {
        return res.status(404).json({ message: 'Aliment introuvable ou non autorisé.' });
      }
  
      res.json(foodItem);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'aliment:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  

  exports.updateFoodItem = async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const foodItemId = req.params.id;
      const {
        foodName,
        servingSize,
        calories,
        protein,
        carbs,
        fats,
      } = req.body;
  
      // Find the food item
      const foodItem = await FoodItem.findOne({
        where: { id: foodItemId },
        include: {
          model: Meal,
          include: {
            model: require('../models/NutritionPlan'),
            where: { userId: req.user.id },
          },
        },
      });
  
      if (!foodItem) {
        return res.status(404).json({ message: 'Aliment introuvable ou non autorisé.' });
      }
  
      // Update the food item
      await foodItem.update({
        foodName,
        servingSize,
        calories,
        protein,
        carbs,
        fats,
      });
  
      res.json(foodItem);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'aliment:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  
  exports.deleteFoodItem = async (req, res) => {
    try {
      const foodItemId = req.params.id;
  
      // Find the food item
      const foodItem = await FoodItem.findOne({
        where: { id: foodItemId },
        include: {
          model: Meal,
          include: {
            model: require('../models/NutritionPlan'),
            where: { userId: req.user.id },
          },
        },
      });
  
      if (!foodItem) {
        return res.status(404).json({ message: 'Aliment introuvable ou non autorisé.' });
      }
  
      // Delete the food item
      await foodItem.destroy();
  
      res.json({ message: 'Aliment supprimé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'aliment:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  