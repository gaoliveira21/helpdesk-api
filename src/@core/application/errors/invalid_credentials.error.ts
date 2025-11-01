export class InvalidCredentialsError extends Error {
  constructor(options?: ErrorOptions) {
    super('Invalid credentials', options);
    this.name = 'InvalidCredentialsError';
  }
}
