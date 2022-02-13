import { ReturnableError } from './generic';

/**
 * Used for returning a 500 - Internal Server Error to the client
 */
export class InternalServerError extends ReturnableError {
  constructor(message?: string) {
    super(message);
    this.statusCode = 500;
    this.name = 'InternalServerError';
    this.description = 'Server encountered an error';
  }
}

/**
 * Used for returning a 400 - Bad Request to the client
 */
export class BadRequestError extends ReturnableError {
  constructor(message?: string) {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
    this.description = 'Request was in invalid syntax';
  }
}

/**
 * Used for returning a 401 - Unauthorized to the client
 */
export class NotAuthenticatedError extends ReturnableError {
  constructor(message?: string) {
    super(message);
    this.statusCode = 401; // Unauthorized (even though it's about authentication...)
    this.name = 'NotAuthenticatedError';
    this.description = 'Authentication required';
  }
}

/**
 * Used for returning a 403 - Forbidden to the client
 */
export class UnauthorizedError extends ReturnableError {
  constructor(message?: string) {
    super(message);
    this.statusCode = 403; // Forbidden
    this.name = 'UnauthorizedError';
    this.description = 'Forbidden';
  }
}

/**
 * Used for returning a 404 - Not Found to the client
 */
export class NotFoundError extends ReturnableError {
  constructor(message?: string) {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
    this.description = 'Not found';
  }
}
