export abstract class DataBuilder<T> {
  protected target: T;

  protected constructor() {}

  build(): T {
    return this.target;
  }
}
