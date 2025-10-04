import { Email, Uuid, PasswordHash } from '../value_objects';
import { CreateTechnicianProps, TechnicianEntity } from './technician.entity';

import { UserEntity } from './user.abstract';

export type CreateAdminProps = {
  name: string;
  email: string;
  plainTextPassword: string;
};

export type RestoreAdminProps = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

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

  static async create({
    name,
    email,
    plainTextPassword,
  }: CreateAdminProps): Promise<AdminEntity> {
    const passwordHash = await PasswordHash.create(plainTextPassword);
    return new AdminEntity(new Uuid(), name, new Email(email), passwordHash);
  }

  static restore({
    id,
    name,
    email,
    passwordHash,
    createdAt,
    updatedAt,
  }: RestoreAdminProps): AdminEntity {
    return new AdminEntity(
      new Uuid(id),
      name,
      new Email(email),
      PasswordHash.fromHash(passwordHash),
      createdAt,
      updatedAt,
    );
  }

  async createTechnician(
    input: Omit<CreateTechnicianProps, 'createdBy'>,
  ): Promise<TechnicianEntity> {
    return TechnicianEntity.create({ ...input, createdBy: this });
  }
}
