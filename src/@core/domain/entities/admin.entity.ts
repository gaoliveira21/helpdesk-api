import { Email, Uuid, PasswordHash } from '../value_objects';

import { UserEntity } from './user.abstract';

export class AdminEntity extends UserEntity {
  private constructor(
    id: Uuid,
    name: string,
    email: Email,
    passwordHash: PasswordHash,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, name, email, passwordHash, createdAt, updatedAt);
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
}
