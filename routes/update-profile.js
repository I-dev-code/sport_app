
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const { body, validationResult } = require('express-validator');


//Route pour update le profile sur la page du dashboard
router.put('/update')