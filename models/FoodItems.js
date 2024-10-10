// models/FoodItem.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Meal = require('./Meal');

const FoodItem = sequelize.define('FoodItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  foodName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  servingSize: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  calories: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  protein: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  carbs: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  fats: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
}, {
  tableName: 'food_items',
  timestamps: true,
});

module.exports = FoodItem;
