import {
  UpdatePasswordInput,
  UpdatePasswordUseCase,
} from 'src/@core/domain/usecases/update_password.usecase';
import { Result } from 'src/@core/domain/usecases/usecase.interface';

import { UserRepository } from '../ports/repositories/user_repository.port';

export class UpdatePassword implements UpdatePasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdatePasswordInput): Promise<Result<void>> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      return { error: new Error('User not found'), data: null };
    }

    await user.changePassword(input.currentPassword, input.newPassword);
    await this.userRepository.save(user);

    return { error: null };
  }
}
