import { AppConfProvider } from 'src/@core/adapters/conf/app_conf_provider';
import { JwtProvider } from 'src/@core/adapters/jwt/jwt_provider';
import { InMemoryUserRepository } from 'src/@core/adapters/repositories/in_memory';
import { UserEntity } from 'src/@core/domain/entities';
import { Uuid } from 'src/@core/domain/value_objects';
import { UserRoleEnum } from 'src/@core/domain/enum/user_role.enum';

import { ValidateAuthenticatedUser } from './validate_authenticated_user';

describe('ValidateAuthenticatedUserUseCase', () => {
  const createUseCase = () => {
    const jwtVerifier = new JwtProvider(new AppConfProvider());
    const userRepository = new InMemoryUserRepository();
    const useCase = new ValidateAuthenticatedUser(jwtVerifier, userRepository);

    return { useCase, jwtVerifier, userRepository };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error for an invalid access token', async () => {
    const { useCase } = createUseCase();

    const { data, error } = await useCase.execute({
      accessToken: 'invalid_access_token',
    });

    expect(data).toBeNull();
    expect(error).toBeDefined();
  });

  it('should return an error if user is not found', async () => {
    const { useCase, jwtVerifier } = createUseCase();

    jest.spyOn(jwtVerifier, 'verify').mockResolvedValueOnce({
      data: { userId: 'non_existent_user_id' },
      error: null,
    });

    const { data, error } = await useCase.execute({
      accessToken: 'valid_access_token',
    });

    expect(data).toBeNull();
    expect(error).toEqual(new Error('User not found'));
  });

  it('should return user data for a valid access token', async () => {
    const { useCase, jwtVerifier, userRepository } = createUseCase();

    const user = UserEntity.restore({
      id: new Uuid().value,
      email: 'test@example.com',
      passwordHash: 'hashed_password',
      name: 'Test User',
      role: UserRoleEnum.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await userRepository.save(user);

    jest.spyOn(jwtVerifier, 'verify').mockResolvedValueOnce({
      data: { userId: user.id.value },
      error: null,
    });

    const { data, error } = await useCase.execute({
      accessToken: 'valid_access_token',
    });

    expect(error).toBeNull();
    expect(data).toEqual({
      userId: user.id.value,
      email: user.email.value,
      role: user.role,
    });
  });
});
