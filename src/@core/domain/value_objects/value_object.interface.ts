export interface ValueObject<T> {
  get value(): T;
  isEqual(vo: this): boolean;
  toString(): string;
}
