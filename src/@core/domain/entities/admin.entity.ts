import { Email } from '../value_objects/email.vo';
import { Uuid } from '../value_objects/uuid.vo';
import { Entity } from './entity.abstract';

export class AdminEntity extends Entity {
  private _name: string;
  private _email: Email;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: Uuid,
    name: string,
    email: Email,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    this._name = name;
    this._email = email;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static create(name: string, email: string): AdminEntity {
    return new AdminEntity(new Uuid(), name, new Email(email));
  }

  static restore(
    id: string,
    name: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
  ): AdminEntity {
    return new AdminEntity(
      new Uuid(id),
      name,
      new Email(email),
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
