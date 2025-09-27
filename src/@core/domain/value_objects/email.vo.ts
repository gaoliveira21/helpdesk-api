import * as z from 'zod';

import { ValueObject } from './value_object.interface';

export class Email implements ValueObject<string> {
  private readonly _value: string;

  constructor(value: string) {
    if (!Email.validate(value)) {
      throw new Error('Invalid email format');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  isEqual(vo: Email): boolean {
    return this._value === vo.value;
  }

  toString(): string {
    return this._value;
  }

  static validate(value: string): boolean {
    const result = z.email().safeParse(value);
    return result.success;
  }
}
