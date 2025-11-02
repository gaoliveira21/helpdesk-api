import { UserRoleEnum } from '../enum/user_role.enum';
import { Email, PasswordHash, Uuid } from '../value_objects';
import { UserEntity } from './user.entity';

export type CreateCustomerProps = {
  name: string;
  email: string;
  plainTextPassword: string;
};

export type RestoreCustomerProps = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export class CustomerEntity extends UserEntity {
  private constructor(
    id: Uuid,
    name: string,
    email: Email,
    passwordHash: PasswordHash,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(
      id,
      name,
      email,
      passwordHash,
      UserRoleEnum.CUSTOMER,
      createdAt,
      updatedAt,
    );
  }

  static async create({
    name,
    email,
    plainTextPassword,
  }: CreateCustomerProps): Promise<CustomerEntity> {
    const passwordHash = await PasswordHash.create(plainTextPassword);
    return new CustomerEntity(new Uuid(), name, new Email(email), passwordHash);
  }

  static restore({
    id,
    name,
    email,
    passwordHash,
    createdAt,
    updatedAt,
  }: RestoreCustomerProps): CustomerEntity {
    return new CustomerEntity(
      new Uuid(id),
      name,
      new Email(email),
      PasswordHash.fromHash(passwordHash),
      createdAt,
      updatedAt,
    );
  }

  changeName(newName: string): void {
    this._name = newName;
    this._updatedAt = new Date();
  }
}
