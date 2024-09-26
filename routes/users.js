const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//route pour créer un utilisateur
router.post('/register', async (req,res) => {
    try {
        const { nom, email, motDePasse } = req.body;
        const newUser = await User.create({ nom, email, motDePasse });
        res.json(newUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur serveur');
    }
});

router.post('/login', async (req, res) => {
    try {
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
            { expires: '1h' }
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


module.exports = router;