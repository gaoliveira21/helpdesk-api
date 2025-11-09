export class ExpiredTokenError extends Error {
  constructor(options?: ErrorOptions) {
    super('The token has expired', options);
    this.name = ExpiredTokenError.name;
  }
}
