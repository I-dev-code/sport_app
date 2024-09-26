const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    //Modèle d'un utilisateur
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    motDePasse: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tablename: 'users', //nom de la table dans la db
    timestamps: true,
});

module.exports = User;