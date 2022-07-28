const AppError = require('../utils/error.utils');

const handleValidationErrorDB = err => {
  const error = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data! ${error}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldDB = err => {
  const value = err.keyValue;
  const message = `Duplicate field value (${Object.values(
    value
  )}), Please use another value!`;
  return new AppError(message, 400);
};

const handleCastErroDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  console.log('ERROR', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldDB(error);
    if (err.name === 'CastError') error = handleCastErroDB(error);

    sendErrorProd(error, req, res);
  }
};
