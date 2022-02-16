import {
  NextFunction, Request, Response,
} from 'express';
import { ReturnableError } from './generic';
import { InternalServerError } from './httpstatus';

/**
 * Middleware function for handling errors nicely.
 * If the error implements ReturnableError, then the error will be sent back as JSON
 * using the status code in the error.
 * Otherwise, a generic Internal Server Error will be returned.
 * @param err The error
 * @param request The Express request object
 * @param response The Express response object
 * @param _next The Express next function
 */
export function handleErrorMiddleware(
  err: Error | string | null,
  request: Request,
  response: Response,
  _next: NextFunction,
) {
  console.error(err);
  if (err instanceof ReturnableError) {
    response.statusCode = err.statusCode;
    response.send(err.json());
  } else {
    const tempError = new InternalServerError();
    response.statusCode = tempError.statusCode;
    response.send(tempError.json());
  }
}
