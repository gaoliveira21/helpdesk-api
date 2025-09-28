import { Email, Uuid, PasswordHash } from '../value_objects';

import { Entity } from './entity.abstract';

export abstract class UserEntity extends Entity {
  protected _name: string;
  protected _email: Email;
  protected _passwordHash: PasswordHash;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  protected constructor(
    id: Uuid,
    name: string,
    email: Email,
    passwordHash: PasswordHash,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    this._name = name;
    this._email = email;
    this._passwordHash = passwordHash;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  get name(): string {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get passwordHash(): PasswordHash {
    return this._passwordHash;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  toString(): string {
    return `${this.constructor.name} { id: ${this._id.toString()}, name: ${this._name}, email: ${this._email.toString()}, createdAt: ${this._createdAt.toISOString()}, updatedAt: ${this._updatedAt.toISOString()} }`;
  }

  toJSON() {
    return {
      id: this._id.toString(),
      name: this._name,
      email: this._email.toString(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
