import { ReturnableError } from './generic';

/**
 * Used for returning a 500 - Internal Server Error to the client
 */
export class InternalServerError extends ReturnableError {
  constructor(message: string = 'Server encountered an error') {
    super(message);
    this.statusCode = 500;
    this.name = 'InternalServerError';
  }
}

/**
 * Used for returning a 400 - Bad Request to the client
 */
export class BadRequestError extends ReturnableError {
  constructor(message: string = 'Request was in invalid syntax') {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
  }
}

/**
 * Used for returning a 401 - Unauthorized to the client
 */
export class NotAuthenticatedError extends ReturnableError {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.statusCode = 401; // Unauthorized (even though it's about authentication...)
    this.name = 'NotAuthenticatedError';
  }
}

/**
 * Used for returning a 403 - Forbidden to the client
 */
export class UnauthorizedError extends ReturnableError {
  constructor(message: string = 'Forbidden') {
    super(message);
    this.statusCode = 403; // Forbidden
    this.name = 'UnauthorizedError';
  }
}

/**
 * Used for returning a 404 - Not Found to the client
 */
export class NotFoundError extends ReturnableError {
  constructor(message: string = 'Not found') {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

/**
 * Temporary placeholder error for returning 405 - Method not allowed
 */
export class NotImplementedError extends ReturnableError {
  constructor(message: string = 'Not yet implemented') {
    super(message);
    this.statusCode = 405;
    this.name = 'NotImplementedError';
  }
}
