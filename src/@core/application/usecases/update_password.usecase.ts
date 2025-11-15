import {
  UpdatePasswordInput,
  UpdatePasswordUseCase,
} from 'src/@core/domain/usecases/update_password.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';
import { EntityNotFoundError } from '../errors/entity_not_found.error';
import { InvalidCredentialsError } from '../errors/invalid_credentials.error';

export class UpdatePassword implements UpdatePasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdatePasswordInput): Promise<Result<void>> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      return { error: new EntityNotFoundError('User'), data: null };
    }

    const error = await user.changePassword(
      input.currentPassword,
      input.newPassword,
    );
    if (error) {
      return { error: new InvalidCredentialsError(error.message), data: null };
    }

    await this.userRepository.save(user);

    return { error: null };
  }
}
