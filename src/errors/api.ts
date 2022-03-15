import { ValidationError } from 'express-validator';
import { BadRequestError, NotFoundError } from './httpstatus';

/**
 * Used when an item from an API endpoint doesn't exist
 */
export class ItemNotFoundError extends NotFoundError {
  constructor(item: string = 'Item') {
    super(`${item} not found.`);
  }
}

/**
 * Used when a request gived bad/missing parameters
 */
export class BadRequestValidationError extends BadRequestError {
  constructor(errors: ValidationError[]) {
    super('Some paramaters were invalid.');
    this.name = 'ValidationError';
    this.description = errors.reduce((acc, err) => {
      const msg = `Param ${err.param}: ${err.msg}`;
      return acc + msg;
    }, '');
  }
}
