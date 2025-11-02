import bcrypt from 'bcryptjs';

import { ValueObject } from './value_object.interface';

export class PasswordHash implements ValueObject<string> {
  private readonly _value: string;
  private static readonly SALT_ROUNDS = Number(
    process.env.PASSWORD_SALT_ROUNDS || 10,
  );

  private constructor(value: string) {
    this._value = value;
  }

  static async create(plainText: string): Promise<PasswordHash> {
    if (plainText.length < 6)
      throw new Error('Password must be at least 6 characters long');

    const hash = await bcrypt.hash(plainText, PasswordHash.SALT_ROUNDS);
    return new PasswordHash(hash);
  }

  static fromHash(hash: string): PasswordHash {
    return new PasswordHash(hash);
  }

  async compare(plainText: string): Promise<boolean> {
    return bcrypt.compare(plainText, this._value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }

  isEqual(other: PasswordHash): boolean {
    return this._value === other._value;
  }
}
