import { Uuid } from '../value_objects';
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
  });

  it('should check equality between two UserEntity instances', async () => {
    const user1 = UserEntity.restore({
      id: new Uuid().value,
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: 'mySecurePassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const user2 = UserEntity.restore({
      id: user1.id.value,
      name: user1.name,
      email: user1.email.value,
      passwordHash: user1.passwordHash.value,
      createdAt: user1.createdAt,
      updatedAt: user1.updatedAt,
    });
    const user3 = UserEntity.restore({
      id: new Uuid().value,
      name: 'Bob',
      email: 'bob@example.com',
      passwordHash: 'anotherPassword',
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
});
