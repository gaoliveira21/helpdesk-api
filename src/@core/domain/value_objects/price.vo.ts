import { ValueObject } from './value_object.interface';

export class Price implements ValueObject<number> {
  private readonly _value: number;
  private readonly _formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Price must be a positive number');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  isEqual(other: Price): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._formatter.format(this._value);
  }
}
