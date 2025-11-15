import {
  RefreshAccessTokenInput,
  RefreshAccessTokenOutput,
  RefreshAccessTokenUseCase,
} from 'src/@core/domain/usecases/refresh_access_token.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { JwtVerifier } from 'src/@core/application/ports/jwt/jwt_verifier.port';
import { JwtSigner } from 'src/@core/application/ports/jwt/jwt_signer.port';
import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';
import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';

export class RefreshAccessToken implements RefreshAccessTokenUseCase {
  constructor(
    private readonly jwtProvider: JwtVerifier & JwtSigner,
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
    const accessToken = await this.jwtProvider.sign(data, accessTokenTtl);

    const refreshTokenTtl = this.confProvider.get('auth.refreshTokenExpiresIn');
    const refreshToken = await this.jwtProvider.sign(data, refreshTokenTtl);

    return {
      data: {
        accessToken: {
          token: accessToken,
          expiresAt: this.calculateExpiryDate(accessTokenTtl),
        },
        refreshToken: {
          token: refreshToken,
          expiresAt: this.calculateExpiryDate(refreshTokenTtl),
        },
      },
      error: null,
    };
  }

  private calculateExpiryDate(ttl: TimeDuration): string {
    const ttlInMs = this.convertTimeDurationToMs(ttl);
    return new Date(Date.now() + ttlInMs).toISOString();
  }

  private convertTimeDurationToMs(ttl: TimeDuration): number {
    const unit = ttl.replace(/\d+/g, '').toLowerCase();
    const value = Number(ttl.replace(/\D+/g, ''));

    switch (unit) {
      case 'w':
        return value * 7 * 24 * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'min':
        return value * 60 * 1000;
      default:
        throw new Error(`Invalid time unit: ${unit}`);
    }
  }
}
