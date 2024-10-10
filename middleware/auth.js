// middleware/auth.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.substring(7, authHeader.length)
    : req.cookies.token || req.query.token;

  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Le token a expiré.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Token invalide.' });
    } else {
      return res.status(500).json({ message: 'Erreur du serveur.' });
    }
  }
};

module.exports = authMiddleware;