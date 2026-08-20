import { sendError } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

export const globalErrorHandler = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    logger.error(`[Error] ${err.message} \nStack: ${err.stack}`);
  }

  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    return sendError(res, message, 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    return sendError(res, message, 400);
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((el) => el.message);
    return sendError(res, `Invalid input data: ${errors.join(', ')}`, 400);
  }

  if (err.isOperational) {
    return sendError(res, err.message, err.statusCode);
  }

  return sendError(res, 'Something went wrong on the server. Please try again later.', 500);
};

