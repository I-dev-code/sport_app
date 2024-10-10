// models/NutritionPlan.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const NutritionPlan = sequelize.define('NutritionPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'nutrition_plans',
  timestamps: true,
});

// Associations
User.hasMany(NutritionPlan);
NutritionPlan.belongsTo(User);

module.exports = NutritionPlan;
