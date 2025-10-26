import { InMemoryUserRepository } from 'src/@core/adapters/repositories/in_memory';
import { Authenticate } from './authenticate.usecase';
import { UserEntity } from 'src/@core/domain/entities';
import { PasswordHash, Uuid } from 'src/@core/domain/value_objects';
import { UserRole } from 'src/@core/domain/enum/user_role.enum';
import { JwtProvider } from 'src/@core/adapters/jwt';

describe('AuthenticateUseCase', () => {
  const createUseCase = () => {
    const jwtProvider = new JwtProvider();
    const userRepository = new InMemoryUserRepository();
    const useCase = new Authenticate(userRepository, jwtProvider);

    return { useCase, userRepository, jwtProvider };
  };

  it('should throw an error if user is not found', async () => {
    const { useCase } = createUseCase();

    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await useCase.execute(input);

    expect(result).toEqual({
      data: null,
      error: new Error('User not found'),
    });
  });

  it('should throw an error if password is incorrect', async () => {
    const { useCase, userRepository } = createUseCase();

    const passwordHash = await PasswordHash.create('hashed_password');
    const user = UserEntity.restore({
      id: new Uuid().value,
      email: 'test@example.com',
      passwordHash: passwordHash.value,
      name: 'Test User',
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await userRepository.save(user);

    const input = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    const result = await useCase.execute(input);

    expect(result).toEqual({
      data: null,
      error: new Error('Password does not match'),
    });
  });

  it('should authenticate user with correct credentials', async () => {
    jest
      .spyOn(JwtProvider.prototype, 'sign')
      .mockResolvedValue('mocked_jwt_token');

    const { useCase, userRepository, jwtProvider } = createUseCase();

    const passwordHash = await PasswordHash.create('correct_password');
    const user = UserEntity.restore({
      id: new Uuid().value,
      email: 'test@example.com',
      passwordHash: passwordHash.value,
      name: 'Test User',
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await userRepository.save(user);

    const input = {
      email: 'test@example.com',
      password: 'correct_password',
    };

    const result = await useCase.execute(input);

    expect(jwtProvider.sign).toHaveBeenCalledWith(
      { userId: user.id.value },
      1800 * 1000,
    );
    expect(result.data?.accessToken.token).toBe('mocked_jwt_token');
    expect(result.data?.accessToken.expiresAt).toBeDefined();
    expect(result.error).toBeNull();
  });
});
