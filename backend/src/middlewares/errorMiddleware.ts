import { AppError } from '@errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'yup';

function errorMiddleware(err: Error, request: Request, response: Response, _next: NextFunction) {
  if (err instanceof ValidationError) {
    return response.status(400).json({
      message: err.errors,
    });
  }
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message,
    });
  }
  return response.status(500).json({
    status: 'Error',
    message: `Internal Server Error ${err.message}`,
  });
}
export { errorMiddleware };
