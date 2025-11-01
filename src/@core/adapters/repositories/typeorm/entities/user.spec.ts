import { UserEntity } from 'src/@core/domain/entities';
import { Uuid } from 'src/@core/domain/value_objects';

import { User } from './user';

describe('TypeORMUserEntity', () => {
  it('should create a User instance from a domain UserEntity', () => {
    const userEntity = UserEntity.restore({
      id: new Uuid().value,
      name: 'John Doe',
      email: 'john.doe@example.com',
      passwordHash: 'hashed_password',
      role: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = User.fromDomain(userEntity);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toEqual(userEntity.id.value);
    expect(user.name).toEqual(userEntity.name);
    expect(user.email).toEqual(userEntity.email.value);
    expect(user.passwordHash).toEqual(userEntity.passwordHash.value);
    expect(user.roleId).toEqual(userEntity.role);
    expect(user.createdAt).toEqual(userEntity.createdAt);
    expect(user.updatedAt).toEqual(userEntity.updatedAt);
  });

  it('should return an domain UserEntity instance when toDomain is called', () => {
    const user = new User();
    user.id = new Uuid().value;
    user.name = 'John Doe';
    user.email = 'john.doe@example.com';
    user.passwordHash = 'hashed_password';
    user.roleId = 1;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    const userEntity = user.toDomain();

    expect(userEntity).toBeInstanceOf(UserEntity);
    expect(userEntity.id.value).toEqual(user.id);
    expect(userEntity.name).toEqual(user.name);
    expect(userEntity.email.value).toEqual(user.email);
    expect(userEntity.passwordHash.value).toEqual(user.passwordHash);
    expect(userEntity.role).toEqual(user.roleId);
    expect(userEntity.createdAt).toEqual(user.createdAt);
    expect(userEntity.updatedAt).toEqual(user.updatedAt);
  });
});
