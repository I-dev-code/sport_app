// middleware/errorHandler.js

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || 'Une erreur est survenue.' });
  }
  
  module.exports = errorHandler;