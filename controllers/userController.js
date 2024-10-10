// controllers/userController.js

const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/authUtils');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { nom, email, motDePasse } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "L'utilisateur existe déjà." });
    }

    // Hash the password
    const passwordHash = await hashPassword(motDePasse);

    // Create the user
    const newUser = await User.create({ nom, email, passwordHash });
    res.json({ id: newUser.id, nom: newUser.nom, email: newUser.email });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, motDePasse } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Adresse email ou mot de passe incorrect." });
    }

    // Check if the password is correct
    const motDePasseValide = await comparePassword(motDePasse, user.passwordHash);
    if (!motDePasseValide) {
      return res.status(400).json({ message: "Adresse email ou mot de passe incorrect." });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Erreur lors de la connexion: ', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Other controller functions (updateProfile, getUserInfo) can be added similarly