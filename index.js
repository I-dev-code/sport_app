// index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/users');
const mealRoutes = require('./routes/meals');
const foodItemRoutes = require('./routes/foodItems');
const errorHandler = require('./middleware/errorHandler');
const nutritionPlanRoutes = require('./routes/nutritionPlans');
const { User, NutritionPlan, Meal, FoodItem } = require('./models');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const models = require('./models');

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Sport Coaching API',
        version: '1.0.0',
        description: 'API documentation for the Sport Coaching application',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    apis: ['./routes/*.js'],
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api/users', userRoutes);

// Home Route
app.get('/', (req, res) => {
  res.send("Backend de l'application de sport");
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;

const rateLimit = require('express-rate-limit');

// Apply to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
});

app.use(limiter);


app.use('/api/nutrition-plans', nutritionPlanRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/food-items', foodItemRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie');

    // Sync models without dropping tables
    await sequelize.sync({ alter: true });
    console.log('Modèles synchronisés');

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
  }
};

startServer();