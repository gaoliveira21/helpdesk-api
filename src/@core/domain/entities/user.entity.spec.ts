import { UserRoleEnum } from '../enum/user_role.enum';
import { PasswordHash, Uuid } from '../value_objects';
import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  it('should restore an existing UserEntity', () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const id = new Uuid().value;
    const user = UserEntity.restore({
      id,
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      passwordHash: 'hashedPassword123',
      role: UserRoleEnum.ADMIN,
      createdAt,
      updatedAt,
    });
    expect(user).toBeInstanceOf(UserEntity);
    expect(user.id.value).toBe(id);
    expect(user.name).toBe('Jane Doe');
    expect(user.email.value).toBe('jane.doe@example.com');
    expect(user.passwordHash.value).toBe('hashedPassword123');
    expect(user.createdAt).toBe(createdAt);
    expect(user.updatedAt).toBe(updatedAt);
    expect(user.role).toBe(UserRoleEnum.ADMIN);
  });

  it('should check equality between two UserEntity instances', async () => {
    const user1 = UserEntity.restore({
      id: new Uuid().value,
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: 'mySecurePassword',
      role: UserRoleEnum.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const user2 = UserEntity.restore({
      id: user1.id.value,
      name: user1.name,
      email: user1.email.value,
      passwordHash: user1.passwordHash.value,
      role: UserRoleEnum.ADMIN,
      createdAt: user1.createdAt,
      updatedAt: user1.updatedAt,
    });
    const user3 = UserEntity.restore({
      id: new Uuid().value,
      name: 'Bob',
      email: 'bob@example.com',
      passwordHash: 'anotherPassword',
      role: UserRoleEnum.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(user1.isEqual(user2)).toBe(true);
    expect(user1.isEqual(user3)).toBe(false);
  });

  it('should convert UserEntity to string', async () => {
    const user = UserEntity.restore({
      id: new Uuid().value,
      name: 'Charlie',
      email: 'charlie@example.com',
      passwordHash: 'pass123',
      role: UserRoleEnum.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(user.toString()).toBe(
      `UserEntity { id: ${user.id.value}, name: Charlie, email: charlie@example.com, createdAt: ${user.createdAt.toISOString()}, updatedAt: ${user.updatedAt.toISOString()} }`,
    );
  });

  it('should convert UserEntity to JSON', async () => {
    const user = UserEntity.restore({
      id: new Uuid().value,
      name: 'Dave',
      email: 'dave@example.com',
      passwordHash: 'pass123',
      role: UserRoleEnum.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    expect(user.toJSON()).toEqual({
      id: user.id.value,
      name: user.name,
      email: user.email.value,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    });
  });

  it('should verify password matching', async () => {
    const passwordHash = await PasswordHash.create('hashedPassword456');
    const user = UserEntity.restore({
      id: new Uuid().value,
      name: 'Eve',
      email: 'eve@example.com',
      passwordHash: passwordHash.value,
      role: UserRoleEnum.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const isMatch = await user.doesPasswordMatch('hashedPassword456');
    const isNotMatch = await user.doesPasswordMatch('wrongPassword');

    expect(isMatch).toBe(true);
    expect(isNotMatch).toBe(false);
  });

  it('should throw error if current password does not match when changing password', async () => {
    const passwordHash = await PasswordHash.create('hashedPassword456');
    const user = UserEntity.restore({
      id: new Uuid().value,
      name: 'Eve',
      email: 'eve@example.com',
      passwordHash: passwordHash.value,
      role: UserRoleEnum.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const error = await user.changePassword('wrongPassword', 'newPassword123');

    expect(error).toEqual(new Error('Current password does not match.'));
  });

  it('should change the password of the user', async () => {
    const password = 'hashedPassword456';
    const passwordHash = await PasswordHash.create(password);
    const user = UserEntity.restore({
      id: new Uuid().value,
      name: 'Eve',
      email: 'eve@example.com',
      passwordHash: passwordHash.value,
      role: UserRoleEnum.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const previousUpdatedAt = user.updatedAt;
    const previousPasswordHash = user.passwordHash.value;

    const newPassword = 'newPassword123';
    await user.changePassword(password, newPassword);

    expect(user.passwordHash.value).not.toBe(previousPasswordHash);
    expect(user.passwordHash.value).not.toBe(newPassword);
    expect(user.updatedAt).not.toBe(previousUpdatedAt);
  });
});
