import { ApplicationError } from './application.error';

export class ExpiredTokenError extends ApplicationError {
  constructor(options?: ErrorOptions) {
    super('The token has expired', options);
    this.name = ExpiredTokenError.name;
  }
}
