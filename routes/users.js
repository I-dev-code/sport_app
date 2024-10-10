//routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/userController');
const { body, validationResult } = require('express-validator');


// Validation middleware
const validateRegistration = [
    body('nom').notEmpty().withMessage('Le nom est requis.'),
    body('email').isEmail().withMessage('Email invalide.'),
    body('motDePasse').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères.'),
  ];
  
  const validateLogin = [
    body('email').isEmail().withMessage('Email invalide.'),
    body('motDePasse').exists().withMessage('Le mot de passe est requis.'),
  ];
  
  // Routes
  router.post('/register', validateRegistration, userController.register);
  router.post('/login', validateLogin, userController.login);



router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});



//Update profile info 
router.put('/updateprofile', authMiddleware, [
    //Validation des champs (optionnel)
    body('genre').optional().isIn(['Homme', 'Femme']).withMessage('Le genre est soit Homme soit femme'),
    body('age').optional().isInt({ min: 0 }).withMessage('L\'age doit être un int positif'),
    body('taille').optional().isFloat({ min: 0 }).withMessage('La taille doit être un nombre en cm'),
    body('poids').optional().isFloat({ min: 0 }).withMessage('Le poids est en kg'),
    body('activityLevel').optional().isIn(['1','2','3','4','5']).withMessage('Votre niveau d\'activité est compris entre 1 et 5')
], async (req, res) => {
    //erreur de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { genre, age, taille, poids, activityLevel } = req.body;

        //update user info
        const updateUser = await User.update(
            { genre, age, taille, poids, activityLevel },
            { where: { id: req.user.id } }
        );
        res.json({ message: 'Profile mis a jour avec succès' });
    } catch (err) {
        console.error('Erreur dans la mise à jour du profile: ', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


//test de mon middleware

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'nom', 'email', 'genre','age','taille','poids','activityLevel'],
        });
        res.json(user);
    } catch (err) {
        console.error('Erreur lors de la récupération des informations utilisateurs: ', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


module.exports = router;