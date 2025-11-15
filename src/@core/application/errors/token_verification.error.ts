import { ApplicationError } from './application.error';

export class TokenVerificationError extends ApplicationError {
  constructor(options?: ErrorOptions) {
    super('Token verification failed', options);
    this.name = TokenVerificationError.name;
  }
}
