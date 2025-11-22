import { AppConfProvider } from 'src/@core/adapters/conf/app_conf_provider';
import { JwtProvider } from 'src/@core/adapters/jwt/jwt_provider';
import { InMemoryUserRepository } from 'src/@core/adapters/repositories/in_memory';
import { UserEntityBuilder } from 'src/__tests__/data_builders/entities';

import { EntityNotFoundError } from '../errors/entity_not_found.error';

import { RefreshAccessToken } from './refresh_access_token.usecase';

describe('RefreshAccessTokenUseCase', () => {
  const createUseCase = (tokenExp: TimeDuration = '30min') => {
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = tokenExp;
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = tokenExp;

    const confProvider = new AppConfProvider();
    const jwtProvider = new JwtProvider(confProvider);
    const userRepository = new InMemoryUserRepository();
    const useCase = new RefreshAccessToken(
      jwtProvider,
      confProvider,
      userRepository,
    );

    return { useCase, confProvider, jwtProvider, userRepository };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error when refresh token is invalid', async () => {
    const { useCase } = createUseCase();

    const { data, error } = await useCase.execute({
      refreshToken: 'invalid_token',
    });

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });

  it('should return an error if user does not exist', async () => {
    const { useCase, jwtProvider } = createUseCase();

    jest.spyOn(jwtProvider, 'verify').mockResolvedValueOnce({
      data: { userId: 'non_existent_user_id' },
      error: null,
    });

    const { data, error } = await useCase.execute({
      refreshToken: 'valid_token',
    });

    expect(data).toBeNull();
    expect(error).toEqual(new EntityNotFoundError('User'));
  });

  it.each<{ duration: TimeDuration; ms: number }>([
    { duration: '30min', ms: 30 * 60 * 1000 },
    { duration: '1h', ms: 60 * 60 * 1000 },
    { duration: '2h', ms: 2 * 60 * 60 * 1000 },
    { duration: '1w', ms: 7 * 24 * 60 * 60 * 1000 },
  ])(
    'should successfully refresh access and refresh tokens',
    async ({ duration, ms }) => {
      jest
        .spyOn(JwtProvider.prototype, 'sign')
        .mockResolvedValue('mocked_jwt_token');

      const user = (await UserEntityBuilder.createAdmin()).build();

      jest.spyOn(JwtProvider.prototype, 'verify').mockResolvedValueOnce({
        data: { userId: user.id.value },
        error: null,
      });

      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      const { useCase, jwtProvider, userRepository, confProvider } =
        createUseCase(duration);

      await userRepository.save(user);

      const { data, error } = await useCase.execute({
        refreshToken: 'valid_token',
      });

      expect(jwtProvider.sign).toHaveBeenNthCalledWith(
        1,
        { userId: user.id.value },
        confProvider.get('auth.accessTokenExpiresIn'),
      );
      expect(data?.accessToken.token).toBe('mocked_jwt_token');
      expect(data?.accessToken.expiresAt).toBe(
        new Date(now + ms).toISOString(),
      );
      expect(jwtProvider.sign).toHaveBeenNthCalledWith(
        2,
        { userId: user.id.value },
        confProvider.get('auth.refreshTokenExpiresIn'),
      );
      expect(data?.refreshToken.token).toBe('mocked_jwt_token');
      expect(data?.refreshToken.expiresAt).toBe(
        new Date(now + ms).toISOString(),
      );
      expect(error).toBeNull();
    },
  );
});
