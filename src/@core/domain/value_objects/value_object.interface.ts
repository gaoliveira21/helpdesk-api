export interface ValueObject<T> {
  get value(): T;
  isEqual(vo: ValueObject<T>): boolean;
  toString(): string;
}
