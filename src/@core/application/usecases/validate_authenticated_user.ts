import {
  ValidateAuthenticatedUserUseCase,
  ValidateAuthenticatedUserInput,
  ValidateAuthenticatedUserOutput,
} from 'src/@core/domain/usecases/validate_authenticated_user.usecase';

import { JwtVerifier } from 'src/@core/application/ports/jwt/jwt_verifier.port';
import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

export class ValidateAuthenticatedUser
  implements ValidateAuthenticatedUserUseCase
{
  constructor(
    private readonly jwtVerifier: JwtVerifier,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    input: ValidateAuthenticatedUserInput,
  ): Promise<Result<ValidateAuthenticatedUserOutput>> {
    const { accessToken } = input;

    const { data, error } = await this.jwtVerifier.verify<{ userId: string }>(
      accessToken,
    );
    if (error) return { error, data: null };

    const user = await this.userRepository.findById(data.userId);
    if (!user) return { error: new Error('User not found'), data: null };

    return {
      error: null,
      data: {
        userId: user.id.value,
        email: user.email.value,
        role: user.role,
      },
    };
  }
}
