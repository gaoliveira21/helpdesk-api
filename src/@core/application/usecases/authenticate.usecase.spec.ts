import { UserEntityBuilder } from 'src/__tests__/data_builders/entities';
import { InMemoryUserRepository } from 'src/@core/adapters/repositories/in_memory';
import { AppConfProvider } from 'src/@core/adapters/conf/app_conf_provider';
import { JwtProvider } from 'src/@core/adapters/jwt/jwt_provider';

import { InvalidCredentialsError } from '../errors/invalid_credentials.error';

import { Authenticate } from './authenticate.usecase';

describe('AuthenticateUseCase', () => {
  const createUseCase = (tokenExp: TimeDuration = '30min') => {
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = tokenExp;
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = tokenExp;

    const confProvider = new AppConfProvider();
    const jwtProvider = new JwtProvider(confProvider);
    const userRepository = new InMemoryUserRepository();
    const useCase = new Authenticate(userRepository, jwtProvider, confProvider);

    return { useCase, userRepository, jwtProvider, confProvider };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if user is not found', async () => {
    const { useCase } = createUseCase();

    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = await useCase.execute(input);

    expect(result).toEqual({
      data: null,
      error: new InvalidCredentialsError(),
    });
  });

  it('should throw an error if password is incorrect', async () => {
    const { useCase, userRepository } = createUseCase();

    const userBuilder = await UserEntityBuilder.createAdmin();
    const user = userBuilder.build();
    await userRepository.save(user);

    const input = {
      email: user.email.value,
      password: 'incorrect_password',
    };

    const result = await useCase.execute(input);

    expect(result).toEqual({
      data: null,
      error: new InvalidCredentialsError(),
    });
  });

  it.each<{ duration: TimeDuration; ms: number }>([
    { duration: '30min', ms: 30 * 60 * 1000 },
    { duration: '1h', ms: 60 * 60 * 1000 },
    { duration: '2h', ms: 2 * 60 * 60 * 1000 },
    { duration: '1w', ms: 7 * 24 * 60 * 60 * 1000 },
  ])(
    'should authenticate user with correct credentials and return access token with %s expiry',
    async ({ duration, ms }) => {
      jest
        .spyOn(JwtProvider.prototype, 'sign')
        .mockResolvedValue('mocked_jwt_token');

      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      const { useCase, userRepository, jwtProvider, confProvider } =
        createUseCase(duration);

      const userBuilder = await UserEntityBuilder.createAdmin();
      const user = userBuilder.build();
      await userRepository.save(user);

      const input = {
        email: user.email.value,
        password: userBuilder.plainTextPassword,
      };

      const result = await useCase.execute(input);

      expect(jwtProvider.sign).toHaveBeenNthCalledWith(
        1,
        { userId: user.id.value },
        confProvider.get('auth.accessTokenExpiresIn'),
      );
      expect(result.data?.accessToken.token).toBe('mocked_jwt_token');
      expect(result.data?.accessToken.expiresAt).toBe(
        new Date(now + ms).toISOString(),
      );
      expect(jwtProvider.sign).toHaveBeenNthCalledWith(
        2,
        { userId: user.id.value },
        confProvider.get('auth.refreshTokenExpiresIn'),
      );
      expect(result.data?.refreshToken.token).toBe('mocked_jwt_token');
      expect(result.data?.refreshToken.expiresAt).toBe(
        new Date(now + ms).toISOString(),
      );
      expect(result.error).toBeNull();
    },
  );
});
