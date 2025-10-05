import { InMemoryUserRepository } from 'src/@core/adapters/repositories/in_memory/user.repository';

import { UpdatePassword } from './update_password.usecase';

describe('UpdatePasswordUseCase', () => {
  const createUseCase = () => {
    const userRepository = new InMemoryUserRepository();
    const useCase = new UpdatePassword(userRepository);

    return { useCase, userRepository };
  };

  it('should throw an error if user is not found', async () => {
    const { useCase } = createUseCase();

    await expect(
      useCase.execute({
        userId: 'non-existent-user-id',
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword123',
      }),
    ).rejects.toThrow('User not found');
  });
});
