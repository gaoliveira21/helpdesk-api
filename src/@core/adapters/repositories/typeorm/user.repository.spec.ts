import { DataSource } from 'typeorm';

import { User } from './entities/user';
import { UserRole } from './entities/user_role';
import { TypeORMUserRepository } from './user.repository';
import { Uuid } from 'src/@core/domain/value_objects';
import { UserEntity } from 'src/@core/domain/entities';

describe('TypeORMUserRepository', () => {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      dropSchema: true,
      entities: [User, UserRole],
    });
    await dataSource.initialize();
  });

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('findById', () => {
    it('should return null if user does not exist', async () => {
      const userRepository = new TypeORMUserRepository(dataSource);

      const user = await userRepository.findById('non-existing-id');
      expect(user).toBeNull();
    });

    it('should return a UserEntity if user exists', async () => {
      const userRepository = new TypeORMUserRepository(dataSource);

      await dataSource.manager.insert(UserRole, { id: 1, name: 'User' });
      const userId = new Uuid().value;
      await dataSource.manager.insert(User, {
        id: userId,
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        passwordHash: 'hashed_password',
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const foundUser = await userRepository.findById(userId);

      expect(foundUser).toBeInstanceOf(UserEntity);
      expect(foundUser?.id.value).toBe(userId);
      expect(foundUser?.name).toBe('Jane Doe');
      expect(foundUser?.email.value).toBe('jane.doe@example.com');
      expect(foundUser?.passwordHash.value).toBe('hashed_password');
      expect(foundUser?.role).toBe(1);
      expect(foundUser?.createdAt).toBeInstanceOf(Date);
      expect(foundUser?.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findByEmail', () => {
    it('should return null if user does not exist', async () => {
      const userRepository = new TypeORMUserRepository(dataSource);

      const user = await userRepository.findByEmail('non.existing@example.com');
      expect(user).toBeNull();
    });

    it('should return a UserEntity if user exists', async () => {
      const userRepository = new TypeORMUserRepository(dataSource);

      await dataSource.manager.insert(UserRole, { id: 1, name: 'User' });
      const userEmail = 'jane.doe@example.com';
      const userId = new Uuid().value;
      await dataSource.manager.insert(User, {
        id: userId,
        name: 'Jane Doe',
        email: userEmail,
        passwordHash: 'hashed_password',
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const foundUser = await userRepository.findByEmail(userEmail);

      expect(foundUser).toBeInstanceOf(UserEntity);
      expect(foundUser?.id.value).toBe(userId);
      expect(foundUser?.name).toBe('Jane Doe');
      expect(foundUser?.email.value).toBe(userEmail);
      expect(foundUser?.passwordHash.value).toBe('hashed_password');
      expect(foundUser?.role).toBe(1);
      expect(foundUser?.createdAt).toBeInstanceOf(Date);
      expect(foundUser?.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('save', () => {
    it('should save a UserEntity to the database', async () => {
      const userRepository = new TypeORMUserRepository(dataSource);

      await dataSource.manager.insert(UserRole, { id: 1, name: 'User' });

      const userEntity = UserEntity.restore({
        id: new Uuid().value,
        name: 'John Smith',
        email: 'john.smith@example.com',
        passwordHash: 'hashed_password',
        role: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await userRepository.save(userEntity);

      const savedUser = await dataSource.manager.findOne(User, {
        where: { id: userEntity.id.value },
      });

      expect(savedUser).not.toBeNull();
      expect(savedUser?.id).toBe(userEntity.id.value);
      expect(savedUser?.name).toBe(userEntity.name);
      expect(savedUser?.email).toBe(userEntity.email.value);
      expect(savedUser?.passwordHash).toBe(userEntity.passwordHash.value);
      expect(savedUser?.roleId).toBe(userEntity.role);
      expect(savedUser?.createdAt.toISOString()).toBe(
        userEntity.createdAt.toISOString(),
      );
      expect(savedUser?.updatedAt.toISOString()).toBe(
        userEntity.updatedAt.toISOString(),
      );
    });
  });
});
