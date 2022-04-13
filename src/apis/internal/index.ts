import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { BadRequestValidationError } from '../../errors/api';

/**
 * Blocks requests that fail any validation, returning ann error to them.
 * @param request Express request object
 * @param response Express response object
 * @param next Express next function
 */
export function blockBadRequests(request: Request, response: Response, next: NextFunction) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    next(new BadRequestValidationError(errors.array()));
  } else {
    next();
  }
}
