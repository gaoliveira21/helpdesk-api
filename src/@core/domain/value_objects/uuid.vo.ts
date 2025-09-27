import { v7 as uuidV7, validate } from 'uuid';

import { ValueObject } from './value_object.interface';

export class Uuid implements ValueObject<string> {
  private _value: string;

  constructor(value?: string) {
    if (!value) {
      this._value = uuidV7();
      return;
    }

    if (!Uuid.validate(value)) {
      throw new Error('Invalid UUID format');
    }

    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  isEqual(vo: ValueObject<string>): boolean {
    return this._value === vo.value;
  }

  toString(): string {
    return this._value;
  }

  static validate(value: string): boolean {
    return validate(value);
  }
}
