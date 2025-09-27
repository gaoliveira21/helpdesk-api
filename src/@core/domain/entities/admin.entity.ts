import { Email, Uuid, PasswordHash } from '../value_objects';

import { Entity } from './entity.abstract';

export class AdminEntity extends Entity {
  private _name: string;
  private _email: Email;
  private _passwordHash: PasswordHash;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
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

  static async create(
    name: string,
    email: string,
    plainTextPassword: string,
  ): Promise<AdminEntity> {
    const passwordHash = await PasswordHash.create(plainTextPassword);
    return new AdminEntity(new Uuid(), name, new Email(email), passwordHash);
  }

  static restore(
    id: string,
    name: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date,
  ): AdminEntity {
    return new AdminEntity(
      new Uuid(id),
      name,
      new Email(email),
      PasswordHash.fromHash(passwordHash),
      createdAt,
      updatedAt,
    );
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
    return `AdminEntity { id: ${this._id.toString()}, name: ${this._name}, email: ${this._email.toString()}, createdAt: ${this._createdAt.toISOString()}, updatedAt: ${this._updatedAt.toISOString()} }`;
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
