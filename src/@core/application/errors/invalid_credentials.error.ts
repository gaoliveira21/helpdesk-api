import { ApplicationError } from './application.error';

export class InvalidCredentialsError extends ApplicationError {
  constructor(message = 'Invalid credentials', options?: ErrorOptions) {
    super(message, options);
    this.name = 'InvalidCredentialsError';
  }
}
