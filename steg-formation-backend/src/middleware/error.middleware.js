/**
 * Middleware de gestion centralisée des erreurs
 * Doit être le dernier app.use() dans server.js
 */
module.exports = (err, req, res, next) => {
  console.error(err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Duplicate field value';
  }

  if (err.code === 'P2003') {
    statusCode = 400;
    message = 'Impossible de supprimer : des données liées existent encore.';
  }

  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack, details: err }),
  });
};
