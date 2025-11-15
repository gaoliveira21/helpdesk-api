import { ApplicationError } from './application.error';

export class EntityNotFoundError extends ApplicationError {
  constructor(entity: string) {
    super(`Entity not found: ${entity}`);
    this.name = 'EntityNotFoundError';
  }
}
