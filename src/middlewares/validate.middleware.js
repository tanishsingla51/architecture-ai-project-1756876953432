import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({ [err.path]: err.msg }));
    throw new ApiError(422, 'Validation failed', extractedErrors);
  }
  next();
};

export { validate };
