import { UserRole } from '../enum/user_role.enum';
import { Email, Uuid, PasswordHash } from '../value_objects';
import { ServiceEntity } from './service.entity';
import { CreateTechnicianProps, TechnicianEntity } from './technician.entity';

import { UserEntity } from './user.entity';

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

export type UpdateTechnicianProps = {
  name?: string;
  email?: string;
  shift?: number[];
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
    super(id, name, email, passwordHash, UserRole.ADMIN, createdAt, updatedAt);
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

  updateTechnician(
    technician: TechnicianEntity,
    { name, email, shift }: UpdateTechnicianProps,
  ) {
    if (name) technician.changeName(name);
    if (email) technician.changeEmail(email);
    if (shift) technician.changeShift(shift);
  }

  createService(name: string, price: number) {
    return ServiceEntity.create({ name, price, createdBy: this });
  }
}
