const { DataTypes } = require('sequelize');
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
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    motDePasse: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    //champs d'information (genre, age, taille,poids)
    genre: {
        type: DataTypes.ENUM('Homme', 'Femme'),
        allowNull: true,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    taille: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    poids: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    tablename: 'users', //nom de la table dans la db
    timestamps: true,
});

module.exports = User;