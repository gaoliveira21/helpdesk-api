import { InMemoryUserRepository } from 'src/@core/adapters/repositories/in_memory/user.repository';

import { UserEntity } from 'src/@core/domain/entities/user.entity';
import { PasswordHash, Uuid } from 'src/@core/domain/value_objects';
import { UserRoleEnum } from 'src/@core/domain/enum/user_role.enum';

import { InvalidCredentialsError } from '../errors/invalid_credentials.error';
import { UpdatePassword } from './update_password.usecase';
import { EntityNotFoundError } from '../errors/entity_not_found.error';

describe('UpdatePasswordUseCase', () => {
  const createUseCase = () => {
    const userRepository = new InMemoryUserRepository();
    const useCase = new UpdatePassword(userRepository);

    return { useCase, userRepository };
  };

  it('should throw an error if user is not found', async () => {
    const { useCase } = createUseCase();

    const { error } = await useCase.execute({
      userId: 'non-existent-user-id',
      currentPassword: 'currentPassword123',
      newPassword: 'newPassword123',
    });

    expect(error).toEqual(new EntityNotFoundError('User'));
  });

  it('should return an error if current password is incorrect', async () => {
    const { useCase, userRepository } = createUseCase();

    const passwordHash = await PasswordHash.create('correctPassword123');
    const user = UserEntity.restore({
      id: new Uuid().value,
      email: 'user@example.com',
      name: 'Test User',
      passwordHash: passwordHash.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: UserRoleEnum.ADMIN,
    });
    await userRepository.save(user);

    const { error } = await useCase.execute({
      userId: user.id.value,
      currentPassword: 'wrongPassword',
      newPassword: 'newPassword123',
    });

    expect(error).toBeInstanceOf(InvalidCredentialsError);
  });

  it('should update the password successfully', async () => {
    const { useCase, userRepository } = createUseCase();

    const currentPassword = 'currentPassword123';
    const passwordHash = await PasswordHash.create(currentPassword);
    const user = UserEntity.restore({
      id: new Uuid().value,
      email: 'user@example.com',
      name: 'Test User',
      passwordHash: passwordHash.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      role: UserRoleEnum.ADMIN,
    });
    await userRepository.save(user);

    const newPassword = 'newPassword123';
    await useCase.execute({
      userId: user.id.value,
      currentPassword,
      newPassword,
    });

    const updatedUser = await userRepository.findById(user.id.value);
    const match = await updatedUser?.doesPasswordMatch(newPassword);

    expect(updatedUser).toBeDefined();
    expect(updatedUser?.passwordHash).not.toBe(passwordHash);
    expect(match).toBe(true);
  });
});
