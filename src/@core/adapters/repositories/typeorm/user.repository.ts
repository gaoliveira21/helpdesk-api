import { DataSource, Repository } from 'typeorm';

import { UserEntity } from 'src/@core/domain/entities';
import { UserRepository } from 'src/@core/application/ports/repositories/user_repository.port';

import { User } from './entities/user';

export class TypeORMUserRepository implements UserRepository {
  private readonly userRepo: Repository<User>;

  constructor(dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) return null;

    return user.toDomain();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) return null;

    return user.toDomain();
  }

  async save(userEntity: UserEntity): Promise<void> {
    await this.userRepo.save(User.fromDomain(userEntity));
  }
}
