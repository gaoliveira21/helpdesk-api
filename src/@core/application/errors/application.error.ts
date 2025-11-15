export abstract class ApplicationError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'ApplicationError';
  }

  toJSON() {
    return {
      type: this.name,
      message: this.message,
    };
  }
}
