// models/WorkoutPlan.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const WorkoutPlan = sequelize.define('WorkoutPlan', {
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
  tableName: 'workout_plans',
  timestamps: true,
});

// Associations
User.hasMany(WorkoutPlan);
WorkoutPlan.belongsTo(User);

module.exports = WorkoutPlan;
