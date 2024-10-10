// models/Meal.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const NutritionPlan = require('./NutritionPlan');
const FoodItem = require('./FoodItems');

const Meal = sequelize.define('Meal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mealType: {
    type: DataTypes.ENUM('Petit déjeuner', 'Déjeuner', 'Dîner', 'Collation'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'meals',
  timestamps: true,
});


module.exports = Meal;
