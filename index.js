require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');
const User = require('./models/User');
const userRoutes = require('./routes/users');
//middleware 

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
//route

app.get('/', (req, res) => {
    res.send('Backend de l\'application de sport');
});

// Tester la connexion a la db

sequelize.authenticate()
.then(() => {
    console.log('connexion a la db reussi');7
})
.catch((err) => {
    console.error('Impossible de se connecter a la db :', err);
});

//Synchro des modèles
sequelize.sync({ force: true }) //pour reset les tables a chaque demarrage mettre a true
.then(() => {
    console.log('Modèles synchronisés');
})
.catch((err) => {
    console.error('Erreur lors de la synchronisation: ', err);
});

// Démarrer le serveur

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});