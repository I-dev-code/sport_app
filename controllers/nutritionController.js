// controllers/nutritionController.js

const NutritionPlan = require('../models/NutritionPlan');
const { validationResult } = require('express-validator');

exports.createNutritionPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const nutritionPlan = await NutritionPlan.create({
      title,
      description,
      UserId: userId,
    });

    res.status(201).json(nutritionPlan);
  } catch (error) {
    console.error('Erreur lors de la création du plan nutritionnel:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Other controller functions (getNutritionPlans, updateNutritionPlan, deleteNutritionPlan)
