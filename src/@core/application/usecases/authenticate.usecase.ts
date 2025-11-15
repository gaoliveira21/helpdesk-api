import {
  AuthenticateInput,
  AuthenticateOutput,
  AuthenticateUseCase,
} from 'src/@core/domain/usecases/authenticate.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';
import { Time } from 'src/@core/domain/value_objects';

import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';
import { JwtSigner } from 'src/@core/application/ports/jwt/jwt_signer.port';
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

    const accessTokenTtl = this.confProvider.get('auth.accessTokenExpiresIn');
    const accessToken = await this.jwtSigner.sign(
      { userId: user.id.value },
      accessTokenTtl,
    );

    const refreshTokenTtl = this.confProvider.get('auth.refreshTokenExpiresIn');
    const refreshToken = await this.jwtSigner.sign(
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
