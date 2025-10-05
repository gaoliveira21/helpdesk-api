import { UserRepository } from 'src/@core/application/ports/user_repository.port';
import { UserEntity } from 'src/@core/domain/entities/user.entity';

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, UserEntity> = new Map();

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) || null;
  }

  async save(user: UserEntity): Promise<void> {
    this.users.set(user.id.value, user);
  }
}
