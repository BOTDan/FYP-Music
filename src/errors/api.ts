import { NotFoundError } from './httpstatus';

/**
 * Used when an item from an API endpoint doesn't exist
 */
export class ItemNotFoundError extends NotFoundError {
  constructor(item: string = 'Item') {
    super(`${item} not found.`);
  }
}
