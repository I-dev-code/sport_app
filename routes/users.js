const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');


//route pour créer un utilisateur
router.post('/register', async (req,res) => {
    try {
        const { nom, email, motDePasse } = req.body;

        //check if user exist
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "L'utilisateur existe deéjà" });
        }

        //hasher le mdp
        const salt = await bcrypt.genSalt(10);
        const mdpHash = await bcrypt.hash(motDePasse, salt);

        //creation du user
        const newUser = await User.create({ nom, email, motDePasse: mdpHash, });
        res.json({ id: newUser.id, nom: newUser.nom, email: newUser.email, });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({message: "Erreur serveur" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, motDePasse } = req.body;
        //vérifié si l'utilisateur existe
        const user = await User.findOne({ where:  { email } });
        if (!user) {
            return res.status(400).json({ message: "Adresse email ou mot de passe incorect." });
        }

        //vérifié si le mot de passe est correct
        const motDePasseValide = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!motDePasseValide) {
            return res.status(400).json({ message: "Adresse email ou mot de passe incorect." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Erreur lors  de la création: ', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

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
], async (req, res) => {
    //erreur de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { genre, age, taille, poids } = req.body;

        //update user info
        const updateUser = await User.update(
            { genre, age, taille, poids },
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
            attributes: ['id', 'nom', 'email'],
        });
        res.json(user);
    } catch (err) {
        console.error('Erreur lors de la récupération des informations utilisateurs: ', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


module.exports = router;