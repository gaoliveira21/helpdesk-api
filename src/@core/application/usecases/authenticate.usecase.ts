import {
  AuthenticateInput,
  AuthenticateOutput,
  AuthenticateUseCase,
} from 'src/@core/domain/usecases/authenticate.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';
import { JwtSigner } from 'src/@core/application/ports/jwt_signer.port';
import { ConfProvider } from 'src/@core/application/ports/conf_provider.port';
import { InvalidCredentialsError } from '../errors/invalid_credentials.error';

export class Authenticate implements AuthenticateUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtSigner: JwtSigner,
    private readonly confProvider: ConfProvider,
  ) {}

  async execute(input: AuthenticateInput): Promise<Result<AuthenticateOutput>> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      return {
        data: null,
        error: new InvalidCredentialsError(),
      };
    }

    const passwordMatched = await user.doesPasswordMatch(input.password);
    if (!passwordMatched) {
      return {
        data: null,
        error: new InvalidCredentialsError(),
      };
    }

    const ttl = this.confProvider.get('auth.accessTokenExpiresIn');
    const accessToken = await this.jwtSigner.sign(
      { userId: user.id.value },
      ttl,
    );

    return {
      data: {
        accessToken: {
          token: accessToken,
          expiresAt: this.calculateExpiryDate(ttl),
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
