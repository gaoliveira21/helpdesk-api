import { faker } from '@faker-js/faker/locale/pt_BR';

import { UserRoleEnum } from 'src/@core/domain/enum/user_role.enum';
import { UserEntity } from 'src/@core/domain/entities';
import { PasswordHash, Uuid } from 'src/@core/domain/value_objects';

import { DataBuilder } from '../builder';

export class UserEntityBuilder extends DataBuilder<UserEntity> {
  private plainTextUserPassword: string;

  constructor(password: string) {
    super();
    this.plainTextUserPassword = password;
  }

  static async create(role: UserRoleEnum): Promise<UserEntityBuilder> {
    const password = faker.string.alphanumeric(10);
    const builder = new UserEntityBuilder(password);

    const passwordHash = await PasswordHash.create(password);
    builder.target = UserEntity.restore({
      id: new Uuid().value,
      email: faker.internet.email(),
      name: faker.person.fullName(),
      passwordHash: passwordHash.value,
      role,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    });

    return builder;
  }

  static async createAdmin(): Promise<UserEntityBuilder> {
    return this.create(UserRoleEnum.ADMIN);
  }

  static async createTechnician(): Promise<UserEntityBuilder> {
    return this.create(UserRoleEnum.TECHNICIAN);
  }

  static async createCustomer(): Promise<UserEntityBuilder> {
    return this.create(UserRoleEnum.CUSTOMER);
  }

  async withPassword(newPlainTextPassword: string): Promise<UserEntityBuilder> {
    const entity = this.getEntity();
    await entity.changePassword(
      this.plainTextUserPassword,
      newPlainTextPassword,
    );

    this.plainTextUserPassword = newPlainTextPassword;

    return this;
  }

  get plainTextPassword(): string {
    return this.plainTextUserPassword;
  }

  private getEntity(): UserEntity {
    return this.target;
  }
}
