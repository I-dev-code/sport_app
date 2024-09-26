const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');


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


//test de mon middleware

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await user.findByPk(req.user.id, {
            attributes: ['id', 'nom', 'email'],
        });
        res.json(user);
    } catch (err) {
        console.error('Erreur lors de la récupération des informations utilisateurs: ', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


module.exports = router;