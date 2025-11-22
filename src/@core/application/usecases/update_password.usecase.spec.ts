import { UserEntityBuilder } from 'src/__tests__/data_builders/entities';

import { InMemoryUserRepository } from 'src/@core/adapters/repositories/in_memory/user.repository';

import { InvalidCredentialsError } from '../errors/invalid_credentials.error';
import { EntityNotFoundError } from '../errors/entity_not_found.error';

import { UpdatePassword } from './update_password.usecase';

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

    const user = (await UserEntityBuilder.createAdmin()).build();
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

    const userBuilder = await UserEntityBuilder.createAdmin();
    const user = userBuilder.build();
    await userRepository.save(user);

    const newPassword = 'newPassword123';
    await useCase.execute({
      userId: user.id.value,
      currentPassword: userBuilder.plainTextPassword,
      newPassword,
    });

    const updatedUser = await userRepository.findById(user.id.value);
    const match = await updatedUser?.doesPasswordMatch(newPassword);

    expect(updatedUser).toBeDefined();
    expect(updatedUser?.passwordHash).not.toBe(user.passwordHash.value);
    expect(match).toBe(true);
  });
});
