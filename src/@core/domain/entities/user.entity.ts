import { UserRoleEnum } from '../enum/user_role.enum';
import { Email, Uuid, PasswordHash } from '../value_objects';

import { Entity } from './entity.abstract';

export type RestoreUserProps = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
};

export class UserEntity extends Entity {
  protected _name: string;
  protected _email: Email;
  protected _passwordHash: PasswordHash;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _role: UserRoleEnum;

  protected constructor(
    id: Uuid,
    name: string,
    email: Email,
    passwordHash: PasswordHash,
    role: UserRoleEnum,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id);
    this._name = name;
    this._email = email;
    this._passwordHash = passwordHash;
    this._role = role;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  static restore({
    id,
    name,
    email,
    passwordHash,
    role,
    createdAt,
    updatedAt,
  }: RestoreUserProps): UserEntity {
    return new UserEntity(
      new Uuid(id),
      name,
      new Email(email),
      PasswordHash.fromHash(passwordHash),
      role,
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

  get role(): UserRoleEnum {
    return this._role;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  async doesPasswordMatch(plainTextPassword: string): Promise<boolean> {
    return this._passwordHash.compare(plainTextPassword);
  }

  async changePassword(
    currentPlainTextPassword: string,
    newPlainTextPassword: string,
  ) {
    const match = await this.doesPasswordMatch(currentPlainTextPassword);
    if (!match) {
      throw new Error('Current password does not match.');
    }
    this._passwordHash = await PasswordHash.create(newPlainTextPassword);
    this._updatedAt = new Date();
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
