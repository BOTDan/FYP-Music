/**
 * An error that can be returned to the client
 */
export class ReturnableError extends Error {
  statusCode: number;
  description: string;
  details?: string;

  constructor(message: string = '') {
    super(message);
    this.statusCode = 500;
    this.name = 'ReturnableError';
    this.description = 'Generic error';
  }

  json() {
    return {
      name: this.name,
      description: this.description,
      details: this.details,
    };
  }
}
