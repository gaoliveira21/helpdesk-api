import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';
import { UserEntity } from 'src/@core/domain/entities/user.entity';

export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, UserEntity> = new Map();
  private usersByEmail: Map<string, string> = new Map();

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const userId = this.usersByEmail.get(email);
    if (!userId) {
      return null;
    }
    return this.users.get(userId) || null;
  }

  async save(user: UserEntity): Promise<void> {
    this.users.set(user.id.value, user);
    this.usersByEmail.set(user.email.value, user.id.value);
  }
}
