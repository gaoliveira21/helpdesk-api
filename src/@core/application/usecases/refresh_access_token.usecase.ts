import {
  RefreshAccessTokenInput,
  RefreshAccessTokenOutput,
  RefreshAccessTokenUseCase,
} from 'src/@core/domain/usecases/refresh_access_token.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';
import { Time } from 'src/@core/domain/value_objects';

import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';
import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';
import { JwtSignerVerifier } from 'src/@core/application/ports/jwt/jwt_signer_verifier.port';

export class RefreshAccessToken implements RefreshAccessTokenUseCase {
  constructor(
    private readonly jwtProvider: JwtSignerVerifier,
    private readonly confProvider: ConfProvider,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    input: RefreshAccessTokenInput,
  ): Promise<Result<RefreshAccessTokenOutput>> {
    const { data, error } = await this.jwtProvider.verify<{ userId: string }>(
      input.refreshToken,
    );
    if (error) return { data: null, error };

    const user = await this.userRepository.findById(data.userId);
    if (!user) return { data: null, error: new Error('User not found') };

    const accessTokenTtl = this.confProvider.get('auth.accessTokenExpiresIn');
    const accessToken = await this.jwtProvider.sign(
      { userId: user.id.value },
      accessTokenTtl,
    );

    const refreshTokenTtl = this.confProvider.get('auth.refreshTokenExpiresIn');
    const refreshToken = await this.jwtProvider.sign(
      { userId: user.id.value },
      refreshTokenTtl,
    );

    return {
      data: {
        accessToken: {
          token: accessToken,
          expiresAt: Time.fromTimeDuration(accessTokenTtl)
            .addTimeToDate(Date.now())
            .toISOString(),
        },
        refreshToken: {
          token: refreshToken,
          expiresAt: Time.fromTimeDuration(refreshTokenTtl)
            .addTimeToDate(Date.now())
            .toISOString(),
        },
      },
      error: null,
    };
  }
}
