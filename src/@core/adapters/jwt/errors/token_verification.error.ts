export class TokenVerificationError extends Error {
  constructor(options?: ErrorOptions) {
    super('Token verification failed', options);
    this.name = TokenVerificationError.name;
  }
}
