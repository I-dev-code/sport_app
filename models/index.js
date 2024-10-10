// models/index.js

const User = require('./User');
const NutritionPlan = require('./NutritionPlan');
const Meal = require('./Meal');
const FoodItem = require('./FoodItems')

// Define associations

// User and NutritionPlan
User.hasMany(NutritionPlan, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
});
NutritionPlan.belongsTo(User, {
  foreignKey: 'userId',
});

// NutritionPlan and Meal
NutritionPlan.hasMany(Meal, {
  foreignKey: 'nutritionPlanId',
  onDelete: 'CASCADE',
});
Meal.belongsTo(NutritionPlan, {
  foreignKey: 'nutritionPlanId',
});

// Meal and FoodItem
Meal.hasMany(FoodItem, {
  foreignKey: 'mealId',
  onDelete: 'CASCADE',
});
FoodItem.belongsTo(Meal, {
  foreignKey: 'mealId',
});

// Export all models
module.exports = {
  User,
  NutritionPlan,
  Meal,
  FoodItem,
  // ... other models
};
