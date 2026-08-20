import { ZodError } from 'zod';
import { AppError } from '../utils/appError.js';

/**
 * Zod body validation middleware.
 * @param {import('zod').ZodSchema} schema
 */
export const validateBody = (schema) => {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        return next(new AppError(`Validation Error: ${formattedErrors.join(', ')}`, 400));
      }
      next(error);
    }
  };
};

/**
 * Zod query validation middleware.
 * @param {import('zod').ZodSchema} schema
 */
export const validateQuery = (schema) => {
  return (req, _res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
        return next(new AppError(`Query Validation Error: ${formattedErrors.join(', ')}`, 400));
      }
      next(error);
    }
  };
};

