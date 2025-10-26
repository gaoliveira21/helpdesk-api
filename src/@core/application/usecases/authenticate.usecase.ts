import {
  AuthenticateInput,
  AuthenticateOutput,
  AuthenticateUseCase,
} from 'src/@core/domain/usecases/authenticate.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';
import { JwtSigner } from 'src/@core/application/ports/jwt_signer.port';

export class Authenticate implements AuthenticateUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtSigner: JwtSigner,
  ) {}

  async execute(input: AuthenticateInput): Promise<Result<AuthenticateOutput>> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      return {
        data: null,
        error: new Error('User not found'),
      };
    }

    const passwordMatched = await user.doesPasswordMatch(input.password);
    if (!passwordMatched) {
      return {
        data: null,
        error: new Error('Password does not match'),
      };
    }

    const ttl = 1800 * 1000; // 30 minutes
    const accessToken = await this.jwtSigner.sign(
      { userId: user.id.value },
      ttl,
    );

    return {
      data: {
        accessToken: {
          token: accessToken,
          expiresAt: new Date(Date.now() + ttl).toISOString(),
        },
      },
      error: null,
    };
  }
}
