import { ValueObject } from './value_object.interface';

export class Hour implements ValueObject<number> {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0 || value > 23) {
      throw new Error('Hour must be between 0 and 23');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  isEqual(other: Hour): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString().padStart(2, '0') + ':00';
  }
}
