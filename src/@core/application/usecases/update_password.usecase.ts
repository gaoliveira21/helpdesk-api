import {
  UpdatePasswordInput,
  UpdatePasswordUseCase,
} from 'src/@core/domain/usecases/update_password.usecase';

import { UserRepository } from '../ports/user_repository.port';

export class UpdatePassword implements UpdatePasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdatePasswordInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('User not found');
    }
  }
}
